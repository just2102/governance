// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

contract ProposalTarget {
    string public message = "Hello World";

    function setMessage(string calldata _message) external {
        message = _message;
    }

    receive() external payable {}
}
   