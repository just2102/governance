// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import './IERC20.sol';

contract Governance {
    IERC20 public token;

    uint public constant PROPOSAL_MIN_DURATION = 60 seconds;

    constructor(IERC20 _token) {
        token = _token;
    }

    enum ProposalState {
        Pending,
        Active,
        Succeeded,
        Defeated,
        Executed
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
    mapping (bytes32 => ProposalVote) public proposalVotes;

    event Proposed(address indexed proposer, bytes32 indexed proposalId);    
    function propose(
        address _to,
        uint _value,
        string calldata _func,
        bytes calldata _data,
        string calldata _description
    ) external returns (bytes32) {
        require(token.balanceOf(msg.sender) > 0, "You must have tokens to propose");

        bytes32 proposalId = generateProposalId(_to, _value, _func, _data, _description);

        require(proposals[proposalId].votingStarts == 0, "Proposal already exists");

        proposals[proposalId] = Proposal({
            votingStarts: block.timestamp,
            votingEnds: block.timestamp + PROPOSAL_MIN_DURATION,
            executed: false
        });
        emit Proposed(msg.sender, proposalId);
        return proposalId;
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

    function vote(bytes32 proposalId, uint8 voteType) external {
        require(getProposalState(proposalId) == ProposalState.Active, "Invalid proposal state");
        uint votingPower = token.balanceOf(msg.sender);
        require(votingPower > 0, "You must have tokens to vote");

        Proposal storage proposal = proposals[proposalId];
        require(proposal.votingEnds > block.timestamp, "Votes are no longer accepted");
        
        ProposalVote storage proposalVote = proposalVotes[proposalId];

        if (voteType == 0) {
            proposalVote.againstVotes += votingPower;
        } else if (voteType == 1) {
            proposalVote.forVotes += votingPower;
        } else if (voteType == 2) {
            proposalVote.abstainVotes += votingPower;
        }

        proposalVote.hasVoted[msg.sender] = true;
    }

    function getProposalState(bytes32 proposalId) public view returns (ProposalState proposalState) {
        Proposal storage proposal = proposals[proposalId];
        ProposalVote storage proposalVote = proposalVotes[proposalId];

        require(proposals[proposalId].votingStarts > 0, "Proposal does not exist");

        if (proposal.executed) {
            return ProposalState.Executed;
        }

        if (proposal.votingEnds > block.timestamp) {
            return ProposalState.Active;
        }

        if (block.timestamp < proposal.votingStarts) {
            return ProposalState.Pending;
        }

        if (proposal.votingEnds < block.timestamp) {
            if (proposalVote.forVotes > proposalVote.againstVotes) {
                if (isSuccessByQuorum(proposalVote.forVotes, proposalVote.againstVotes)) {
                    return ProposalState.Succeeded;
                }
            } else {
                return ProposalState.Defeated;
            }
        }
    }

    function isSuccessByQuorum(uint forVotes, uint againstVotes) private pure returns (bool) {
        uint totalValidVotes = forVotes + againstVotes;
        if (totalValidVotes == 0) return false;

        uint forVotePercentage = (forVotes * 100) / totalValidVotes;

        return forVotePercentage > 70;
    }

    function executeProposal(
        address _to,
        uint _value,
        string calldata _func,
        bytes calldata _data,
        string calldata _description
    ) external returns (bytes memory) {
        bytes32 proposalId = generateProposalId(_to, _value, _func, _data, _description);
        
        require(getProposalState(proposalId) == ProposalState.Succeeded, "Proposal must be in succeeded state");
        
        Proposal storage proposal = proposals[proposalId];

        proposal.executed = true;

        bytes memory data;
        if (bytes(_func).length > 0) {
            data = abi.encodePacked(
                bytes4(keccak256(bytes(_func))), _data
            );
        } else {
            data = _data;
        }

        (bool success, bytes memory response) = _to.call{value: _value}(_data);
        require(success, "tx failed");

        return response;
    }

    receive() payable external {}
}