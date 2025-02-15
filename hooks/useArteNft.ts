import { ADDRESS_ARTE, listIP } from "@/constants/config"
import { AlchemyNftSchema } from "@/lib/validation/types"
import { useQuery } from "@tanstack/react-query"

interface QueryData {
    ownedNfts: AlchemyNftSchema[]
}

export const useArteNft = () => {
    const address = ADDRESS_ARTE
    const contractAdresses = listIP
    const { data: ownedNfts, isLoading: nftArteLoading } = useQuery<QueryData>({
        queryKey: ["ArteNft", address, contractAdresses],
        queryFn: async () => {
            const response = await fetch(
                `/api/nft-metadata`
            )
            return response.json()
        },
        refetchInterval: 600000000
    })

    const nftArte: AlchemyNftSchema[] = ownedNfts?.ownedNfts || []

    const nftArteData = nftArte && Array.isArray(nftArte) && nftArte?.filter((nft) => nft.mint.mintAddress === ADDRESS_ARTE)

    return { nftArteData, nftArteLoading }
}