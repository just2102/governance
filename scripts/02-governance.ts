import { Addressable } from "ethers";
import { ethers } from "hardhat";
import { Governance } from "../typechain-types";

export async function deployGovernance(erc20Address: string | Addressable) {
  const Governance = await ethers.deployContract("Governance", [erc20Address]);

  await Governance.waitForDeployment();

  console.log("Governance deployed to:", Governance.target);
  return Governance;
}
