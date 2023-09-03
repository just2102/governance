import { Governance } from "../../typechain-types";

export enum ProposalStatesEnum {
  PENDING = 0,
  ACTIVE = 1,
  SUCCEEDED = 2,
  DEFEATED = 3,
  EXECUTED = 4,
}

export async function getProposalState(
  Governance: Governance,
  proposalId: string
) {
  const proposalState = await Governance.getProposalState(proposalId);
  return Number(proposalState) as ProposalStatesEnum;
}
