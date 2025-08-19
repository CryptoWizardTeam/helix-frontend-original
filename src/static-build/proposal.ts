import { Proposal as ProposalType } from '@aave/contract-helpers';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { enhanceProposalWithTimes } from '../modules/governance/utils/formatProposal';
import { governanceContract } from '../modules/governance/utils/governanceProvider';
import { isProposalStateImmutable } from '../modules/governance/utils/immutableStates';

export type CustomProposalType = Omit<ProposalType, 'values'> & {
  startTimestamp: number;
  creationTimestamp: number;
  expirationTimestamp: number;
};

// Use JSON file for storage
const file = join(process.cwd(), 'src/static-build', 'proposals.json');

function readProposalsData(): { proposals: CustomProposalType[] } {
  try {
    const content = readFileSync(file, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return { proposals: [] };
  }
}

function writeProposalsData(data: { proposals: CustomProposalType[] }) {
  writeFileSync(file, JSON.stringify(data, null, 2));
}

export class Proposal {
  count() {
    const data = readProposalsData();
    return data.proposals?.length || 0;
  }

  get(id: number) {
    const data = readProposalsData();
    const value = data.proposals?.find(p => p.id === id);
    if (!value) throw new Error(`trying to fetch proposal cache, but failed for id ${id}`);
    return value;
  }

  async populate(id: number) {
    const data = readProposalsData();
    
    const value = data.proposals?.find(p => p.id === id);
    if (value && isProposalStateImmutable(value)) return value;
    
    const { values, ...rest } = await governanceContract.getProposal({ proposalId: id });
    const proposal = await enhanceProposalWithTimes(rest);
    
    // only store data when it can no longer change
    if (value) {
      // update
      const index = data.proposals.findIndex((p) => p.id === id);
      data.proposals[index] = proposal;
    } else {
      data.proposals.push(proposal);
    }
    
    writeProposalsData(data);
    return proposal;
  }
}
