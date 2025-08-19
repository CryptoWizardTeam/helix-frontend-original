import { ProposalMetadata } from '@aave/contract-helpers';
// import { base58 } from 'ethers/lib/utils';
import matter from 'gray-matter';
import fetch from 'isomorphic-unfetch';
import { governanceConfig } from 'src/ui-config/governanceConfig';

type MemorizeMetadata = Record<string, ProposalMetadata>;
const MEMORIZE: MemorizeMetadata = {};

/**
 * Composes a URI based off of a given IPFS CID hash and gateway
 * @param  {string} hash - The IPFS CID hash
 * @param  {string} gateway - The IPFS gateway host
 * @returns string
 */
export function getLink(hash: string, gateway: string): string {
  return `${gateway}/${hash}`;
}

/**
 * Fetches the IPFS metadata JSON from our preferred public gateway, once.
 * If the gateway fails, attempt to fetch recursively with a fallback gateway, once.
 * If the fallback fails, throw an error.
 * @param  {string} hash - The IPFS CID hash to query
 * @param  {string} gateway - The IPFS gateway host
 * @returns Promise
 */
export async function getProposalMetadata(
  hash: string,
  gateway: string
): Promise<ProposalMetadata> {
  try {
    return await fetchFromIpfs(hash, gateway);
  } catch (e) {
    console.groupCollapsed('Fetching proposal metadata from IPFS...');
    console.info('failed with', gateway);

    // Primary gateway failed, retry with fallback
    if (gateway === governanceConfig.ipfsGateway) {
      console.info('retrying with', governanceConfig.fallbackIpfsGateway);
      console.error(e);
      console.groupEnd();
      return getProposalMetadata(hash, governanceConfig.fallbackIpfsGateway);
    }

    // Fallback gateway failed, exit
    console.info('exiting');
    console.error(e);
    console.groupEnd();
    throw e;
  }
}

/**
 * Fetches data from a provided IPFS gateway with a simple caching mechanism.
 * Cache keys are the hashes, values are ProposalMetadata objects.
 * The cache does not implement any invalidation mechanisms nor sets expiries.
 * @param  {string} hash - The IPFS CID hash to query
 * @param  {string} gateway - The IPFS gateway host
 * @returns Promise
 */
/**
 * Base32 encoder for IPFS CID conversion
 */
function base32Encode(buffer: Buffer): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz234567';
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Converts a hex hash to IPFS CIDv1 format (base32)
 * @param hexHash - The hex hash starting with 0x
 * @returns CIDv1 string in base32 format
 */
function hexToCIDv1(hexHash: string): string {
  // Remove 0x prefix
  const hashBytes = hexHash.slice(2);
  
  // Create multihash: 0x12 (sha256) + 0x20 (32 bytes) + hash
  const multihash = Buffer.from(`1220${hashBytes}`, 'hex');
  
  // Create CIDv1: version(1) + codec(0x55 = raw) + multihash
  const cidBytes = Buffer.concat([
    Buffer.from([0x01]), // CIDv1
    Buffer.from([0x55]), // raw codec  
    multihash
  ]);
  
  // Encode as base32 with 'b' prefix for CIDv1
  return 'b' + base32Encode(cidBytes);
}

async function fetchFromIpfs(hash: string, gateway: string): Promise<ProposalMetadata> {
  // Read from cache
  console.log('[Nahman] hash', hash);
  const ipfsHash = hash.startsWith('0x')
    ? hexToCIDv1(hash)
    : hash;
  console.log('[Nahman] ipfsHash', ipfsHash);
  if (MEMORIZE[ipfsHash]) return MEMORIZE[ipfsHash];

  // Fetch
  const ipfsResponse: Response = await fetch(getLink(ipfsHash, gateway));
  console.log('[Nahman] ipfsResponse', ipfsResponse);
  if (!ipfsResponse.ok) throw Error('Fetch not working');
  const clone = await ipfsResponse.clone();

  // Store in cache
  try {
    const response = await ipfsResponse.json();
    console.log('[Nahman] ipfsResponse.json()', response);
    
    // Check if this is a Snapshot governance format
    if (response.data && response.data.message) {
      const message = response.data.message;
      console.log('[Nahman] Snapshot format detected');
      
      MEMORIZE[ipfsHash] = {
        title: message.title || '',
        description: message.body || '',
        shortDescription: message.body ? message.body.substring(0, 100) + '...' : '',
        discussions: message.discussion || '',
        author: response.address || '',
        aip: 0, // Will be set by calling code if needed
        ipfsHash,
        // Additional Snapshot-specific fields
        choices: message.choices || [],
        start: message.start || 0,
        end: message.end || 0,
        snapshot: message.snapshot || 0,
        space: message.space || '',
        type: message.type || '',
      } as ProposalMetadata & {
        choices?: string[];
        start?: number;
        end?: number;
        snapshot?: number;
        space?: string;
        type?: string;
      };
    } else {
      // Try to parse as traditional AIP markdown format
      const { content, data } = matter(response.description || '');
      console.log('[Nahman] Traditional AIP format detected');
      console.log('[Nahman] content', content);
      console.log('[Nahman] data', data);
      
      MEMORIZE[ipfsHash] = {
        ...response,
        ipfsHash,
        description: content,
        ...data,
      } as ProposalMetadata;
    }
  } catch (e) {
    // Fallback: try to parse as plain text markdown
    const text = await clone.text();
    const { content, data } = matter(text);
    console.log('[Nahman] Fallback text parsing');
    
    MEMORIZE[ipfsHash] = {
      ...(data as ProposalMetadata),
      ipfsHash,
      description: content,
    };
  }
  return MEMORIZE[ipfsHash];
}
