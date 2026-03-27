// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {GuardedTreasuryVault} from "../src/GuardedTreasuryVault.sol";

contract BootstrapGuardedTreasuryVault is Script {
    error MismatchedLimitConfig();

    function run() external {
        address vaultAddress = vm.envAddress("ROOTSTOCK_GUARDED_VAULT_ADDRESS");
        GuardedTreasuryVault vault = GuardedTreasuryVault(payable(vaultAddress));

        address[] memory allowedAssets = vm.envOr("ROOTSTOCK_ALLOWED_ASSETS", ",", new address[](0));
        address[] memory allowedDestinations = vm.envOr("ROOTSTOCK_ALLOWED_DESTINATIONS", ",", new address[](0));
        address[] memory limitAssets = vm.envOr("ROOTSTOCK_LIMIT_ASSETS", ",", new address[](0));
        uint256[] memory limitValues = vm.envOr("ROOTSTOCK_LIMIT_VALUES", ",", new uint256[](0));

        if (limitAssets.length != limitValues.length) revert MismatchedLimitConfig();

        vm.startBroadcast();

        for (uint256 i = 0; i < allowedAssets.length; i++) {
            vault.setAllowedAsset(allowedAssets[i], true);
        }

        for (uint256 i = 0; i < allowedDestinations.length; i++) {
            vault.setAllowedDestination(allowedDestinations[i], true);
        }

        for (uint256 i = 0; i < limitAssets.length; i++) {
            vault.setMaxTransferAmount(limitAssets[i], limitValues[i]);
        }

        vm.stopBroadcast();
    }
}
