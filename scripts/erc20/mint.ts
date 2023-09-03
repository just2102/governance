import { ethers } from "hardhat";
import { ERC20 } from "../../typechain-types";

export async function mint(ERC20: ERC20, signerAddress: string) {
  const mintTx = await ERC20.mint(ethers.parseEther("5000"), signerAddress);
  await mintTx.wait();
}
