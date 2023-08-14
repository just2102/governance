// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "./ERC20.sol";

contract GovernanceToken is ERC20 {
    constructor() ERC20("Governance Token", "GTK", 1000000) {}
}