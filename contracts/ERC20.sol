// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.18;

import "./IERC20.sol";

contract ERC20 is IERC20 {
    uint totalTokens;
    address public owner;
    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowances;

    string _name;
    string _symbol;

    constructor(
        string memory name_,
        string memory symbol_,
        uint initialSupply
    ) {
        _name = name_;
        _symbol = symbol_;
        owner = msg.sender;
        mint(initialSupply, owner);
    }

    function name() external view returns (string memory) {
        return _name;
    }

    function symbol() external view returns (string memory) {
        return _symbol;
    }

    function decimals() external pure returns (uint) {
        return 18; // 1 token = 1 wei
    }

    function totalSupply() external view returns (uint) {
        return totalTokens;
    }

    function balanceOf(address _account) public view returns (uint) {
        return balances[_account];
    }

    function transfer(
        address _to,
        uint _amount
    ) external hasEnoughTokens(msg.sender, _amount) {
        _beforeTokenTransfer(msg.sender, _to, _amount);
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
        emit Transfer(msg.sender, _to, _amount);
    }

    function allowance(
        address _owner,
        address _spender
    ) public view returns (uint) {
        return allowances[_owner][_spender];
    }

    function approve(address _spender, uint _amount) public {
        allowances[msg.sender][_spender] = _amount;
        emit Approve(msg.sender, _spender, _amount);
    }

    function transferFrom(
        address _from,
        address _to,
        uint _amount
    ) public hasEnoughTokens(_from, _amount) {
        _beforeTokenTransfer(_from, _to, _amount);
        require(allowances[_from][_to] >= _amount, "check allowances!");
        allowances[_from][_to] -= _amount;

        balances[_from] -= _amount;
        balances[_to] += _amount;
        emit Transfer(_from, _to, _amount);
    }

    modifier hasEnoughTokens(address _from, uint _amount) {
        require(balanceOf(_from) >= _amount, "Not enough tokens!");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not an owner!");
        _;
    }

    function mint(uint _amount, address _shop) public onlyOwner {
        _beforeTokenTransfer(address(0), _shop, _amount);
        balances[_shop] += _amount;
        totalTokens += _amount;
        emit Transfer(address(0), _shop, _amount);
    }

    function burn(
        address _from,
        uint _amount
    ) public onlyOwner hasEnoughTokens(_from, _amount) {
        _beforeTokenTransfer(_from, address(0), _amount);
        balances[_from] -= _amount;
        totalTokens -= _amount;
        emit Transfer(_from, address(0), _amount);
    }

    function _beforeTokenTransfer(
        address _from,
        address _to,
        uint _amount
    ) internal virtual {}
}
