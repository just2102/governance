import { Addressable } from "ethers";
import { ethers } from "hardhat";
import { Governance } from "../typechain-types";

async function deployERC20() {
  const ERC20 = await ethers.deployContract("ERC20", ["Test Token", "TST", 18]);

  await ERC20.waitForDeployment();

  console.log("ERC20 deployed to:", ERC20.target);
  return ERC20;
}

async function deployGovernance(erc20Address: string | Addressable) {
  const Governance = await ethers.deployContract("Governance", [erc20Address]);

  await Governance.waitForDeployment();

  console.log("Governance deployed to:", Governance.target);
  return Governance;
}

async function getProposal(Governance: Governance, proposalId: string) {
  const proposal = await Governance.proposals(proposalId);
  return proposal;
}

async function main() {
  const ERC20 = await deployERC20();
  const signers = await ethers.getSigners();
  const signer = signers[0];
  console.log("Signer:", signer.address);

  const mintTx = await ERC20.mint(ethers.parseEther("5000"), signer.address);
  await mintTx.wait();

  const balance = await ERC20.balanceOf(signer.address);
  console.log("Balance:", ethers.formatEther(balance));

  const Governance = await deployGovernance(ERC20.target);

  const proposalTx = await Governance.propose(
    signer.address,
    ethers.parseEther("25"),
    "Test Proposal",
    ethers.toUtf8Bytes("test bytes"),
    "test description"
  );

  const proposalReceipt = await proposalTx.wait();

  const proposalId = proposalReceipt?.logs[0].topics[2];
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
