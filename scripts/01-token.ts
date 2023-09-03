import { ethers } from "hardhat";

export async function deployERC20() {
  const ERC20 = await ethers.deployContract("ERC20", ["Test Token", "TST", 18]);

  await ERC20.waitForDeployment();

  console.log("ERC20 deployed to:", ERC20.target);
  return ERC20;
}
