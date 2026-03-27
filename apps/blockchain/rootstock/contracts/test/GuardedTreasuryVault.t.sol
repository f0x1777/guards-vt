// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {GuardedTreasuryVault} from "../src/GuardedTreasuryVault.sol";

contract MockERC20 {
    mapping(address => uint256) public balanceOf;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        uint256 senderBalance = balanceOf[msg.sender];
        require(senderBalance >= amount, "insufficient-balance");
        unchecked {
            balanceOf[msg.sender] = senderBalance - amount;
        }
        balanceOf[to] += amount;
        return true;
    }
}

contract GuardedTreasuryVaultTest is Test {
    GuardedTreasuryVault internal vault;
    MockERC20 internal token;

    address internal governance = address(0xA11CE);
    address internal operator = address(0xB0B);
    address internal stranger = address(0xCAFE);
    address internal destination = address(0x2000);

    function setUp() public {
        vault = new GuardedTreasuryVault(governance, operator);
        token = new MockERC20();
    }

    function testGovernanceCanConfigureGuardrails() public {
        vm.startPrank(governance);
        vault.setAllowedAsset(address(token), true);
        vault.setAllowedDestination(destination, true);
        vault.setMaxTransferAmount(address(token), 5 ether);
        vault.setAllowedAsset(address(0), true);
        vault.setMaxTransferAmount(address(0), 3 ether);
        vm.stopPrank();

        assertTrue(vault.allowedAssets(address(token)));
        assertTrue(vault.allowedDestinations(destination));
        assertEq(vault.maxTransferAmount(address(token)), 5 ether);
        assertEq(vault.maxTransferAmount(address(0)), 3 ether);
    }

    function testNonGovernanceCannotConfigureGuardrails() public {
        vm.prank(stranger);
        vm.expectRevert(GuardedTreasuryVault.NotGovernance.selector);
        vault.setAllowedAsset(address(token), true);
    }

    function testUnauthorizedCallerCannotExecuteTransfer() public {
        _configureTokenPath(1 ether);

        vm.prank(stranger);
        vm.expectRevert(GuardedTreasuryVault.NotAuthorized.selector);
        vault.executeTransfer(address(token), destination, 1 ether, bytes32("unauthorized"));
    }

    function testExecutionRejectsAssetNotAllowed() public {
        vm.prank(operator);
        vm.expectRevert(GuardedTreasuryVault.AssetNotAllowed.selector);
        vault.executeTransfer(address(token), destination, 1 ether, bytes32("asset"));
    }

    function testExecutionRejectsDestinationNotAllowed() public {
        vm.startPrank(governance);
        vault.setAllowedAsset(address(token), true);
        vault.setMaxTransferAmount(address(token), 1 ether);
        vm.stopPrank();

        vm.prank(operator);
        vm.expectRevert(GuardedTreasuryVault.DestinationNotAllowed.selector);
        vault.executeTransfer(address(token), destination, 1 ether, bytes32("destination"));
    }

    function testPausedVaultRejectsExecution() public {
        _configureTokenPath(1 ether);

        vm.prank(governance);
        vault.setPaused(true);

        vm.prank(operator);
        vm.expectRevert(GuardedTreasuryVault.VaultPaused.selector);
        vault.executeTransfer(address(token), destination, 1 ether, bytes32("transfer"));
    }

    function testOperatorCanExecuteErc20TransferWithinBounds() public {
        _configureTokenPath(10 ether);
        token.mint(address(vault), 4 ether);

        vm.prank(operator);
        vault.executeTransfer(address(token), destination, 1 ether, bytes32("transfer-1"));

        assertEq(token.balanceOf(address(vault)), 3 ether);
        assertEq(token.balanceOf(destination), 1 ether);
        assertTrue(vault.usedReferenceIds(bytes32("transfer-1")));
    }

    function testGovernanceCanExecuteNativeWithdrawalWithinBounds() public {
        vm.startPrank(governance);
        vault.setAllowedAsset(address(0), true);
        vault.setAllowedDestination(destination, true);
        vault.setMaxTransferAmount(address(0), 2 ether);
        vm.stopPrank();

        vm.deal(address(vault), 3 ether);
        uint256 beforeBalance = destination.balance;

        vm.prank(governance);
        vault.executeWithdrawal(address(0), destination, 1 ether, bytes32("withdrawal-1"));

        assertEq(address(vault).balance, 2 ether);
        assertEq(destination.balance, beforeBalance + 1 ether);
        assertTrue(vault.usedReferenceIds(bytes32("withdrawal-1")));
    }

    function testDuplicateReferenceIdIsRejected() public {
        _configureTokenPath(10 ether);
        token.mint(address(vault), 3 ether);

        vm.prank(operator);
        vault.executeTransfer(address(token), destination, 1 ether, bytes32("dup-ref"));

        vm.prank(operator);
        vm.expectRevert(GuardedTreasuryVault.DuplicateReferenceId.selector);
        vault.executeTransfer(address(token), destination, 1 ether, bytes32("dup-ref"));
    }

    function testWithdrawalRemainsGovernanceOnly() public {
        vm.startPrank(governance);
        vault.setAllowedAsset(address(0), true);
        vault.setAllowedDestination(destination, true);
        vault.setMaxTransferAmount(address(0), 1 ether);
        vm.stopPrank();

        vm.prank(operator);
        vm.expectRevert(GuardedTreasuryVault.NotGovernance.selector);
        vault.executeWithdrawal(address(0), destination, 1 ether, bytes32("withdrawal"));
    }

    function testExecutionRejectsUnsetLimit() public {
        vm.startPrank(governance);
        vault.setAllowedAsset(address(token), true);
        vault.setAllowedDestination(destination, true);
        vm.stopPrank();

        vm.prank(operator);
        vm.expectRevert(GuardedTreasuryVault.TransferLimitExceeded.selector);
        vault.executeTransfer(address(token), destination, 1 ether, bytes32("no-limit"));
    }

    function testTransferLimitStillAppliesBeforeExecution() public {
        _configureTokenPath(1 ether);

        vm.prank(operator);
        vm.expectRevert(GuardedTreasuryVault.TransferLimitExceeded.selector);
        vault.executeTransfer(address(token), destination, 2 ether, bytes32("limit"));
    }

    function testZeroAmountIsRejected() public {
        _configureTokenPath(1 ether);

        vm.prank(operator);
        vm.expectRevert(GuardedTreasuryVault.InvalidAmount.selector);
        vault.executeTransfer(address(token), destination, 0, bytes32("zero"));
    }

    function _configureTokenPath(uint256 limit) internal {
        vm.startPrank(governance);
        vault.setAllowedAsset(address(token), true);
        vault.setAllowedDestination(destination, true);
        vault.setMaxTransferAmount(address(token), limit);
        vm.stopPrank();
    }
}
