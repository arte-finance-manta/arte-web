import { AlchemyNftSchema } from "@/lib/validation/types";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

interface QueryData {
  ownedNfts: AlchemyNftSchema[];
}

export const useOwnerNft = ({
  contractAdresses,
}: {
  contractAdresses: string[];
}) => {
  const { address } = useAccount();

  const { data: ownedNfts, isLoading: nftLoading } = useQuery<QueryData>({
    queryKey: ["ownedNfts", address, contractAdresses],
    queryFn: async () => {
      const response = await fetch(
        `/api/nft?ownerAddress=${address}&contractAddress=${contractAdresses}`
      );
      return response.json();
    },
  });

  const nftData: AlchemyNftSchema[] = ownedNfts?.ownedNfts || [];

  return { nftData, nftLoading };
};
