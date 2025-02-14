import { mockOracleABI } from "@/lib/abi/mockOracleABI";
import { useReadContract } from "wagmi";

export const usePriceOracle = (
    addressOracle: HexAddress,
    tokenId: string
) => {
    const { data, isLoading: priceOracleLoading } = useReadContract({
        abi: mockOracleABI,
        address: addressOracle as HexAddress,
        functionName: "getPrice",
        args: [
            BigInt(tokenId)
        ],
    });

    const priceOracle = data && parseInt(data.toString());

    return {
        priceOracle,
        priceOracleLoading
    };
};