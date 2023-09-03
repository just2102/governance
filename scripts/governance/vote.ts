import { ethers } from "hardhat";
import { Governance } from "../../typechain-types";

export async function vote(Governance: Governance, proposalId: string) {
  const voteTx = await Governance.vote(proposalId, 1);
  const voteReceipt = await voteTx.wait();
  console.log("voted successfully");
  return voteReceipt;
}
