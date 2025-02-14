import { ADDRESS_ARTE } from "@/constants/config";
import { AlchemyNftSchema } from "@/lib/validation/types";

interface QueryData {
    ownedNfts: AlchemyNftSchema[];
}

export const getNFTArte = async () => {
    const address = ADDRESS_ARTE;
    const contractAddresses = [
        "0xd856695F2789a2b7a7B3f6BfFB1a829516bAEfeE",
        "0x9639F2dFc37B24D472Ca5b8CDe5e663d30ff872b",
        "0xC8d171F5AF4598b7a29c87B9341ec95025D252b8",
    ];

    let nftArteData: AlchemyNftSchema[] = [];
    let nftArteLoading = true;

    try {
        const response = await fetch(
            `/api/nft?ownerAddress=${address}&contractAddress=${contractAddresses}`
        );
        const data: QueryData = await response.json();
        nftArteData = data.ownedNfts || [];
    } catch (error) {
        console.error("Error fetching NFT data:", error);
    } finally {
        nftArteLoading = false;
    }

    return { nftArteData, nftArteLoading };
};
