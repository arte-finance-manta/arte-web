import { normalize } from "@/lib/helper/bignumber";
import { erc20Abi } from "viem";
import { useReadContract } from "wagmi";

export const useERC20CuratorBalance = ({
  address,
  tokenAddress
}: {
  address: HexAddress,
  tokenAddress: HexAddress
}) => {
  const { data, isLoading: balanceLoading, error: balanceError, refetch: bRefecth } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: "balanceOf",
    args: [
      address as HexAddress
    ],
    query: {
      refetchInterval: 4000
    }
  });

  const bNormalized = normalize(Number(data), 6)

  return {
    balanceLoading,
    balanceError,
    bNormalized,
    bRefecth
  };
};