// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {GuardedTreasuryVault} from "../src/GuardedTreasuryVault.sol";

contract DeployGuardedTreasuryVault {
    function deploy(address governance, address operator) external returns (GuardedTreasuryVault vault) {
        vault = new GuardedTreasuryVault(governance, operator);
    }
}
