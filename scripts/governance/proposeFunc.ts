import { Addressable } from "ethers";
import { Governance } from "../../typechain-types";

export async function proposeFunc(
  Governance: Governance,
  _to: string | Addressable,
  _value: bigint,
  _func: string,
  _data: string,
  _description: string
) {
  const proposalTx = await Governance.propose(
    _to,
    _value,
    _func,
    _data,
    _description
  );
  const proposalReceipt = await proposalTx.wait();

  const proposalId = proposalReceipt?.logs[0].topics[2];
  console.log("Proposal ID:", proposalId);

  const proposal = await Governance.proposals(proposalId!);
  console.log("Proposal", proposal);
  return proposalId;
}
