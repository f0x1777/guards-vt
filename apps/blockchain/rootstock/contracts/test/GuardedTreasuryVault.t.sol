// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {GuardedTreasuryVault} from "../src/GuardedTreasuryVault.sol";

contract GuardedTreasuryVaultTest is Test {
    GuardedTreasuryVault internal vault;

    address internal governance = address(0xA11CE);
    address internal operator = address(0xB0B);
    address internal stranger = address(0xCAFE);
    address internal asset = address(0x1000);
    address internal destination = address(0x2000);

    function setUp() public {
        vault = new GuardedTreasuryVault(governance, operator);
    }

    function testGovernanceCanConfigureGuardrails() public {
        vm.startPrank(governance);
        vault.setAllowedAsset(asset, true);
        vault.setAllowedDestination(destination, true);
        vault.setMaxTransferAmount(asset, 5 ether);
        vm.stopPrank();

        assertTrue(vault.allowedAssets(asset));
        assertTrue(vault.allowedDestinations(destination));
        assertEq(vault.maxTransferAmount(asset), 5 ether);
    }

    function testNonGovernanceCannotConfigureGuardrails() public {
        vm.prank(stranger);
        vm.expectRevert(GuardedTreasuryVault.NotGovernance.selector);
        vault.setAllowedAsset(asset, true);
    }

    function testUnauthorizedCallerCannotExecuteTransfer() public {
        vm.startPrank(governance);
        vault.setAllowedAsset(asset, true);
        vault.setAllowedDestination(destination, true);
        vault.setMaxTransferAmount(asset, 1 ether);
        vm.stopPrank();

        vm.prank(stranger);
        vm.expectRevert(GuardedTreasuryVault.NotAuthorized.selector);
        vault.executeTransfer(asset, destination, 1 ether, bytes32("unauthorized"));
    }

    function testExecutionRejectsAssetNotAllowed() public {
        vm.prank(operator);
        vm.expectRevert(GuardedTreasuryVault.AssetNotAllowed.selector);
        vault.executeTransfer(asset, destination, 1 ether, bytes32("asset"));
    }

    function testExecutionRejectsDestinationNotAllowed() public {
        vm.startPrank(governance);
        vault.setAllowedAsset(asset, true);
        vault.setMaxTransferAmount(asset, 1 ether);
        vm.stopPrank();

        vm.prank(operator);
        vm.expectRevert(GuardedTreasuryVault.DestinationNotAllowed.selector);
        vault.executeTransfer(asset, destination, 1 ether, bytes32("destination"));
    }

    function testPausedVaultRejectsExecution() public {
        vm.startPrank(governance);
        vault.setAllowedAsset(asset, true);
        vault.setAllowedDestination(destination, true);
        vault.setPaused(true);
        vm.stopPrank();

        vm.prank(operator);
        vm.expectRevert(GuardedTreasuryVault.VaultPaused.selector);
        vault.executeTransfer(asset, destination, 1 ether, bytes32("transfer"));
    }

    function testExecutionRevertsUntilCustodyLogicIsImplemented() public {
        vm.startPrank(governance);
        vault.setAllowedAsset(asset, true);
        vault.setAllowedDestination(destination, true);
        vault.setMaxTransferAmount(asset, 10 ether);
        vm.stopPrank();

        vm.prank(operator);
        vm.expectRevert(GuardedTreasuryVault.ExecutionNotImplemented.selector);
        vault.executeTransfer(asset, destination, 1 ether, bytes32("transfer"));

        vm.prank(governance);
        vm.expectRevert(GuardedTreasuryVault.ExecutionNotImplemented.selector);
        vault.executeWithdrawal(asset, destination, 1 ether, bytes32("withdrawal"));
    }

    function testWithdrawalRemainsGovernanceOnly() public {
        vm.startPrank(governance);
        vault.setAllowedAsset(asset, true);
        vault.setAllowedDestination(destination, true);
        vault.setMaxTransferAmount(asset, 10 ether);
        vm.stopPrank();

        vm.prank(operator);
        vm.expectRevert(GuardedTreasuryVault.NotGovernance.selector);
        vault.executeWithdrawal(asset, destination, 1 ether, bytes32("withdrawal"));
    }

    function testExecutionRejectsUnsetLimit() public {
        vm.startPrank(governance);
        vault.setAllowedAsset(asset, true);
        vault.setAllowedDestination(destination, true);
        vm.stopPrank();

        vm.prank(operator);
        vm.expectRevert(GuardedTreasuryVault.TransferLimitExceeded.selector);
        vault.executeTransfer(asset, destination, 1 ether, bytes32("no-limit"));
    }

    function testTransferLimitStillAppliesBeforeExecution() public {
        vm.startPrank(governance);
        vault.setAllowedAsset(asset, true);
        vault.setAllowedDestination(destination, true);
        vault.setMaxTransferAmount(asset, 1 ether);
        vm.stopPrank();

        vm.prank(operator);
        vm.expectRevert(GuardedTreasuryVault.TransferLimitExceeded.selector);
        vault.executeTransfer(asset, destination, 2 ether, bytes32("limit"));
    }
}
