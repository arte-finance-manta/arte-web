import { ADDRESS_ARTE } from "@/constants/config";
import { mockArteABI } from "@/lib/abi/mockArteABI";
import { useReadContract } from "wagmi";

export const useGetPosition = (poolId: string, tokenId: string) => {
  return useReadContract({
    abi: mockArteABI,
    address: ADDRESS_ARTE,
    functionName: "positions",
    args: [poolId, BigInt(tokenId)],
  });
};
