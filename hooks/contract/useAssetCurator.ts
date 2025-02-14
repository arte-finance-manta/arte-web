import { mockCuratorABI } from "@/lib/abi/mockCuratorABI";
import { useReadContract } from "wagmi";

export const useAssetCurator = (curatorAddress: HexAddress) => {
    const { data: assetCurator, isLoading: assetCuratorLoading } = useReadContract({
        abi: mockCuratorABI,
        address: curatorAddress,
        functionName: "asset",
        args: [],
    });

    return {
        assetCurator,
        assetCuratorLoading
    };
};