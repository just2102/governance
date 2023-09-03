import { Governance } from "../../typechain-types";
export async function getProposal(Governance: Governance, proposalId: string) {
  const proposal = await Governance.proposals(proposalId);
  return proposal;
}
