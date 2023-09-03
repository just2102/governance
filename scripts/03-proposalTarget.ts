import { ethers } from "hardhat";

export async function deployProposalTarget() {
  const ProposalTarget = await ethers.deployContract("ProposalTarget", []);
  await ProposalTarget.waitForDeployment();
  console.log("ProposalTarget deployed to:", ProposalTarget.target);
  return ProposalTarget;
}
