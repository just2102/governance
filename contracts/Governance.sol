// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import './IERC20.sol';

contract Governance {
    IERC20 public token;

    uint public constant PROPOSAL_MIN_DURATION = 60;

    constructor(IERC20 _token) {
        token = _token;
    }

    struct ProposalVote {
        uint againstVotes;
        uint forVotes;
        uint abstainVotes;
        
        mapping(address => bool) hasVoted;
    }

    struct Proposal {
        uint votingStarts;
        uint votingEnds;
        bool executed;
    }
    mapping (bytes32 => Proposal) public proposals;

    event Proposed(address indexed proposer, bytes32 indexed proposalId);    
    function propose(
        address _to,
        uint _value,
        string calldata _func,
        bytes calldata _data,
        string calldata _description
    ) external {
        require(token.balanceOf(msg.sender) > 0, "You must have tokens to propose");

        bytes32 proposalId = generateProposalId(_to, _value, _func, _data, _description);

        proposals[proposalId] = Proposal({
            votingStarts: block.timestamp,
            votingEnds: block.timestamp + PROPOSAL_MIN_DURATION,
            executed: false
        });
        emit Proposed(msg.sender, proposalId);
    }

    function generateProposalId (
        address _to,
        uint _value,
        string calldata _func,
        bytes calldata _data,
        string calldata _description
    ) internal pure returns (bytes32) {
       return keccak256(abi.encode(_to,_value,_func,_data,_description));
    }
}