import { NextRequest, NextResponse } from "next/server";

const API_ALCHEMY = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

export const GET = async (request: NextRequest) => {
    const tokenId = request.nextUrl.searchParams.get("tokenId");
    const contractAddresses = request.nextUrl.searchParams.getAll("contractAddress"); 

    if (!tokenId) {
        return NextResponse.json({ error: "tokenId is required" }, { status: 400 });
    }

    if (contractAddresses.length === 0) {
        return NextResponse.json({ error: "At least one contractAddress is required" }, { status: 400 });
    }

    const url = `https://base-sepolia.g.alchemy.com/nft/v3/${API_ALCHEMY}/getOwnersForNFT?contractAddress=${contractAddresses}&tokenId=${tokenId}`

    const response = await fetch(url, {
        method: "GET",
        headers: {
            accept: "application/json"
        },
    });

    if (!response.ok) {
        return NextResponse.json({ error: `Error fetching NFTs: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json(data);
}
