import { ethers } from "hardhat";
import { deployGovernance } from "./02-governance";
import { deployERC20 } from "./01-token";
import { deployProposalTarget } from "./03-proposalTarget";
import { proposeEmpty } from "./governance/proposeEmpty";
import { mint } from "./erc20/mint";

async function main() {
  const ERC20 = await deployERC20();
  const signers = await ethers.getSigners();
  const signer = signers[0];
  console.log("Signer:", signer.address);

  await mint(ERC20, signer.address);

  const balance = await ERC20.balanceOf(signer.address);
  console.log("Signer ERC20 balance:", ethers.formatEther(balance));

  const Governance = await deployGovernance(ERC20.target);
  const ProposalTarget = await deployProposalTarget();

  const proposalId = await proposeEmpty(Governance, ProposalTarget);
  console.log("Proposal ID:", proposalId);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
