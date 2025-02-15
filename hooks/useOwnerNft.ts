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
        `/api/nft-metadata`
      );
      return response.json();
    },
  });

  const nft: AlchemyNftSchema[] = ownedNfts?.ownedNfts || [];

  const nftData = nft && Array.isArray(nft) && nft?.filter((nft) => nft.mint.mintAddress === address)

  return { nftData, nftLoading };
};