import { Governance } from "../../typechain-types";
import { Addressable } from "ethers";
import { ethers } from "hardhat";

export async function executeProposal(
  Governance: Governance,
  proposalId: string,
  _to: string | Addressable,
  _value: bigint,
  _func: string,
  _data: string,
  _description: string
) {
  await fastForward();
  const executeTx = await Governance.executeProposal(
    _to,
    _value,
    _func,
    _data,
    _description
  );
  const executeReceipt = await executeTx.wait();
  console.log("executed successfully");
  return executeReceipt;
}

async function fastForward() {
  await ethers.provider.send("evm_increaseTime", [86400 * 3]);
  await ethers.provider.send("evm_mine"); // mine a new block
}
