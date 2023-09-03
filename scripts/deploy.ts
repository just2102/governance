import { ethers } from "hardhat";
import { deployGovernance } from "./02-governance";
import { deployERC20 } from "./01-token";
import { deployProposalTarget } from "./03-proposalTarget";
import { proposeEmpty } from "./governance/proposeEmpty";
import { mint } from "./erc20/mint";
import { getProposal } from "./governance/getProposal";
import { proposeFunc } from "./governance/proposeFunc";
import { ProposalTarget, Governance } from "../typechain-types";
import { vote } from "./governance/vote";
import {
  ProposalStatesEnum,
  getProposalState,
} from "./governance/getProposalState";
import { executeProposal } from "./governance/executeProposal";

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

  // await proposeEmpty(Governance, ProposalTarget);

  const proposalId = await proposeFunc(
    Governance,
    ProposalTarget.target,
    ethers.parseEther("25"),
    "setMessage(string)",
    ethers.AbiCoder.defaultAbiCoder().encode(["string"], ["test message"]),
    ethers.solidityPackedKeccak256(["string"], ["test description"])
  );
  await vote(Governance, proposalId!);

  await send26EthToGovernance(Governance);

  await executeProposal(
    Governance,
    proposalId!,
    ProposalTarget.target,
    ethers.parseEther("25"),
    "setMessage(string)",
    ethers.AbiCoder.defaultAbiCoder().encode(["string"], ["test message"]),
    ethers.solidityPackedKeccak256(["string"], ["test description"])
  );

  const message = await ProposalTarget.message();
  console.log("new message", message);

  const newBalance = await ProposalTarget.balances(Governance.target);
  console.log("new balance", ethers.formatEther(newBalance));
}

async function send26EthToGovernance(Governance: Governance) {
  const signers = await ethers.getSigners();
  const signer = signers[0];
  const tx = await signer.sendTransaction({
    to: Governance.target,
    value: ethers.parseEther("26"),
  });
  console.log(
    "new governance balance",
    ethers.formatEther(await ethers.provider.getBalance(Governance.target))
  );
  await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
