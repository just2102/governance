// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

contract ProposalTarget {
    string public message = "Hello World";
    mapping(address => uint) public balances;

    function setMessage(string calldata _message) external payable {
        message = _message;
        balances[msg.sender] += msg.value;
    }

    receive() external payable {}
}
   