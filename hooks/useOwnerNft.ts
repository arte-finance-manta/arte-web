import { listIP } from "@/constants/config";
import { mockIPABI } from "@/lib/abi/mockIPABI";
import { AlchemyNftSchema } from "@/lib/validation/types";
import { useAccount, useReadContract } from "wagmi";

export const useOwnerNft = ({
  contractAdresses,
}: {
  contractAdresses: string[];
}) => {
  const { address } = useAccount();

  const { data, isLoading: nftLoading } = useReadContract({
    abi: mockIPABI,
    address: listIP[0] as HexAddress,
    functionName: "getAllTokenMetadataByAddressMinted",
    args: [address],
  })

  const parsedData = data ? JSON.parse(data as any) : [];

  const nftData: AlchemyNftSchema[] = parsedData as AlchemyNftSchema[] || [];

  return { nftData, nftLoading };
};
