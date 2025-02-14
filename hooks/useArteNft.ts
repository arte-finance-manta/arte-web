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
                `/api/nft?ownerAddress=${address}&contractAddress=${contractAdresses}`
            )
            return response.json()
        },
        refetchInterval: 600000000
    })

    const nftArteData: AlchemyNftSchema[] = ownedNfts?.ownedNfts || []

    return { nftArteData, nftArteLoading }
}