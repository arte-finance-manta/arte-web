import { listIP } from "@/constants/config";
import { mockIPABI } from "@/lib/abi/mockIPABI";
import { NextResponse } from "next/server";
import { createPublicClient, http } from 'viem';
import { mantaSepoliaTestnet } from 'viem/chains';

const publicClient = createPublicClient({
  chain: mantaSepoliaTestnet,
  transport: http('https://pacific-rpc.sepolia-testnet.manta.network/http')
});

export const GET = async () => {
  try {
    let allNftData: any = [];

    for (const ipAddress of listIP) {
      try {
        const result = await publicClient.readContract({
          address: ipAddress as HexAddress,
          abi: mockIPABI,
          functionName: 'listAllToken',
        });

        const listIds = (result as any).map((item: any) => Number(item));
        if (listIds.length === 0) continue;

        const nftDataPromises = listIds.map(async (tokenId: any) => {
          try {
            const resultOwner = await publicClient.readContract({
              address: ipAddress as HexAddress,
              abi: mockIPABI,
              functionName: 'ownerOf',
              args: [BigInt(tokenId)],
            });

            return {
              contract: {
                address: ipAddress,
                name: "IP Contract",
                symbol: "IPC",
                totalSupply: null,
                tokenType: "ERC721",
                contractDeployer: "0xc876f3c2b40d89F6920A70394D02AacfDc50ed45",
                deployedBlockNumber: 18862546,
                openSeaMetadata: {
                  floorPrice: null,
                  collectionName: null,
                  collectionSlug: null,
                  safelistRequestStatus: null,
                  imageUrl: null,
                  description: null,
                  externalUrl: null,
                  twitterUsername: null,
                  discordUrl: null,
                  bannerImageUrl: null,
                  lastIngestedAt: null
                },
                isSpam: null,
                spamClassifications: []
              },
              tokenId: tokenId.toString(),
              tokenType: "ERC721",
              name: null,
              description: null,
              tokenUri: null,
              image: {
                cachedUrl: null,
                thumbnailUrl: null,
                pngUrl: null,
                contentType: null,
                size: null,
                originalUrl: null
              },
              raw: {
                tokenUri: null,
                metadata: {},
                error: "Malformed token uri, do not retry"
              },
              collection: null,
              mint: {
                mintAddress: resultOwner,
                blockNumber: 18864212,
                timestamp: "2024-12-06T14:51:52Z",
                transactionHash: "null"
              },
              owners: null,
              timeLastUpdated: new Date().toISOString(),
              balance: "1",
              acquiredAt: {
                blockTimestamp: null,
                blockNumber: null
              }
            };
          } catch (error) {
            console.error(`Error fetching data for token ${tokenId} on contract ${ipAddress}:`, error);
            return null;
          }
        });

        const nftDataResults = await Promise.all(nftDataPromises);
        allNftData = allNftData.concat(nftDataResults.filter((data): data is NonNullable<typeof data> => data !== null));
      } catch (error) {
        console.error(`Error fetching token list for contract ${ipAddress}:`, error);
      }
    }

    return NextResponse.json({ ownedNfts: allNftData });
  } catch (error) {
    console.error("Error fetching NFT data:", error);
    return NextResponse.json(
      { error: "Failed to fetch NFT data" },
      { status: 500 }
    );
  }
};
