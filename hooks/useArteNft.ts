import { ADDRESS_ARTE, listIP } from "@/constants/config"
import { mockIPABI } from "@/lib/abi/mockIPABI"
import { AlchemyNftSchema } from "@/lib/validation/types"
import { useReadContract } from "wagmi"

export const useArteNft = () => {
    const address = ADDRESS_ARTE

    const { data, isLoading: nftArteLoading } = useReadContract({
        abi: mockIPABI,
        address: listIP[0] as HexAddress,
        functionName: "getAllTokenMetadataByAddressMinted",
        args: [address],
    })

    const parsedData = data ? JSON.parse(data as any) : [];

    const nftArteData: AlchemyNftSchema[] = parsedData as AlchemyNftSchema[] || []

    return { nftArteData, nftArteLoading }
}