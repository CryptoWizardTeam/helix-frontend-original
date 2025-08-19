import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { getProposalMetadata } from 'src/modules/governance/utils/getProposalMetadata';
import { governanceConfig } from 'src/ui-config/governanceConfig';

import { CustomProposalType } from './proposal';

export interface IpfsType {
  id: number;
  aip: number;
  originalHash: string;
  ipfsHash: string;
  description: string;
  shortDescription: string;
  author: string;
  discussions: string;
  title: string;
}

// Use JSON file for storage
const file = join(process.cwd(), 'src/static-build', 'ipfsFiles.json');

function readIpfsData(): { ipfs: IpfsType[] } {
  try {
    const content = readFileSync(file, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return { ipfs: [] };
  }
}

function writeIpfsData(data: { ipfs: IpfsType[] }) {
  writeFileSync(file, JSON.stringify(data, null, 2));
}

export class Ipfs {
  get(id: number) {
    const data = readIpfsData();
    const value = data.ipfs?.find(i => i.id === id);
    if (!value) throw new Error(`trying to fetch ipfs cache, but failed for id ${id}`);
    return value;
  }

  async populate(id: number, proposal: CustomProposalType) {
    const data = readIpfsData();

    const value = data.ipfs?.find(i => i.id === id);
    if (value) return;
    if (!proposal) throw new Error(`error populating proposal ${id}`);
    
    const ipfs = await getProposalMetadata(proposal.ipfsHash, governanceConfig.ipfsGateway);
    const newIpfs = { ...ipfs, originalHash: proposal.ipfsHash, id };
    data.ipfs.push(newIpfs);
    
    writeIpfsData(data);
    return;
  }
}
