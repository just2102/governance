import { Governance } from "../../typechain-types";
import { Addressable } from "ethers";
import { ethers } from "hardhat";

export async function executeProposal(
  Governance: Governance,
  _to: string | Addressable,
  _value: bigint,
  _func: string,
  _data: string,
  _description: string
) {
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
