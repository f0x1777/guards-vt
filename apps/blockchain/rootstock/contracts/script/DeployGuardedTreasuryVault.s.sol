// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {GuardedTreasuryVault} from "../src/GuardedTreasuryVault.sol";

contract DeployGuardedTreasuryVault is Script {
    GuardedTreasuryVault public lastDeployedVault;

    function deploy(address governance, address operator) external returns (GuardedTreasuryVault vault) {
        vault = new GuardedTreasuryVault(governance, operator);
        lastDeployedVault = vault;
    }

    function run() external {
        address governance = vm.envAddress("GOVERNANCE");
        address operator = vm.envAddress("OPERATOR");

        vm.startBroadcast();
        lastDeployedVault = new GuardedTreasuryVault(governance, operator);
        vm.stopBroadcast();
    }
}
