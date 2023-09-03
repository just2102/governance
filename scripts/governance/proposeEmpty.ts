import { Governance, ProposalTarget } from "../../typechain-types";
import { ethers } from "hardhat";

export async function proposeEmpty(
  Governance: Governance,
  ProposalTarget: ProposalTarget
) {
  const proposalTx = await Governance.propose(
    ProposalTarget.target,
    ethers.parseEther("25"),
    "Test Proposal",
    "0x",
    "test description"
  );

  const proposalReceipt = await proposalTx.wait();

  const emptyProposalId = proposalReceipt?.logs[0].topics[2];
  console.log("Empty proposal ID:", emptyProposalId);

  const emptyProposal = await Governance.proposals(emptyProposalId!);
  console.log("Empty proposal", emptyProposal);
  return emptyProposalId;
}
