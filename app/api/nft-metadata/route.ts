import { ADDRESS_ARTE, listIP } from "@/constants/config";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const ownerAddress = request.nextUrl.searchParams.get("ownerAddress");
  const contractAddresses =
    request.nextUrl.searchParams.getAll("contractAddress");
  const address = ADDRESS_ARTE

  if (!ownerAddress) {
    return NextResponse.json(
      { error: "ownerAddress is required" },
      { status: 400 }
    );
  }

  if (contractAddresses.length === 0) {
    return NextResponse.json(
      { error: "At least one contractAddress is required" },
      { status: 400 }
    );
  }

  // ownerAddress == mint -> mintAddress
  // contractAddresses == listIP

  const response = `
    {
      "ownedNfts": [
        {
          "contract": {
            "address": ${listIP[0]},
            "name": "IP 2",
            "symbol": "IP2",
            "totalSupply": null,
            "tokenType": "ERC721",
            "contractDeployer": "0x1d7beeDfB25b6bA584B01a4aD2D9e380Ba4f2E2d",
            "deployedBlockNumber": 18862546,
            "openSeaMetadata": {
              "floorPrice": null,
              "collectionName": null,
              "collectionSlug": null,
              "safelistRequestStatus": null,
              "imageUrl": null,
              "description": null,
              "externalUrl": null,
              "twitterUsername": null,
              "discordUrl": null,
              "bannerImageUrl": null,
              "lastIngestedAt": null
            },
            "isSpam": null,
            "spamClassifications": []
          },
          "tokenId": "444",
          "tokenType": "ERC721",
          "name": null,
          "description": null,
          "tokenUri": null,
          "image": {
            "cachedUrl": null,
            "thumbnailUrl": null,
            "pngUrl": null,
            "contentType": null,
            "size": null,
            "originalUrl": null
          },
          "raw": {
            "tokenUri": null,
            "metadata": {},
            "error": "Malformed token uri, do not retry"
          },
          "collection": null,
          "mint": {
            "mintAddress": ${ownerAddress},
            "blockNumber": 18864212,
            "timestamp": "2024-12-06T14:51:52Z",
            "transactionHash": "0xd17a7fba7c92cb440739acf268c8a0f1fc63ab3f7e54dcc0c271ce336c4fa91d"
          },
          "owners": null,
          "timeLastUpdated": "2025-02-14T14:24:51.353Z",
          "balance": "1",
          "acquiredAt": {
            "blockTimestamp": null,
            "blockNumber": null
          }
        },
        {
          "contract": {
            "address": "0x9E422dAE52EF8CBec73D4b27594ca9da55833d21",
            "name": "IP 1",
            "symbol": "IP1",
            "totalSupply": null,
            "tokenType": "ERC721",
            "contractDeployer": "0x1d7beeDfB25b6bA584B01a4aD2D9e380Ba4f2E2d",
            "deployedBlockNumber": 19040031,
            "openSeaMetadata": {
              "floorPrice": null,
              "collectionName": null,
              "collectionSlug": null,
              "safelistRequestStatus": null,
              "imageUrl": null,
              "description": null,
              "externalUrl": null,
              "twitterUsername": null,
              "discordUrl": null,
              "bannerImageUrl": null,
              "lastIngestedAt": null
            },
            "isSpam": null,
            "spamClassifications": []
          },
          "tokenId": "35",
          "tokenType": "ERC721",
          "name": null,
          "description": null,
          "tokenUri": null,
          "image": {
            "cachedUrl": null,
            "thumbnailUrl": null,
            "pngUrl": null,
            "contentType": null,
            "size": null,
            "originalUrl": null
          },
          "raw": {
            "tokenUri": null,
            "metadata": {},
            "error": "Malformed token uri, do not retry"
          },
          "collection": null,
          "mint": {
            "mintAddress": "0x3b4f0135465d444a5bd06ab90fc59b73916c85f5",
            "blockNumber": 19633870,
            "timestamp": "2024-12-24T10:27:08Z",
            "transactionHash": "0x2d69dbb244882e1796fc884f789ae708c6c60ce2ff322d412981de345af04fc8"
          },
          "owners": null,
          "timeLastUpdated": "2025-02-14T14:24:51.345Z",
          "balance": "1",
          "acquiredAt": {
            "blockTimestamp": null,
            "blockNumber": null
          }
        }
      ]
    }
  `

  return NextResponse.json(response);
};
