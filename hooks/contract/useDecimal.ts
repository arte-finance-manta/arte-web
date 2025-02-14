import { erc20Abi } from "viem";
import { useReadContract } from "wagmi";

export const useDecimal = (addressToken: HexAddress) => {
    const { data: decimal, isLoading: decimalLoading } = useReadContract({
        abi: erc20Abi,
        address: addressToken,
        functionName: "decimals",
        args: [],
    });

    return {
        decimal: decimal as number,
        decimalLoading
    };
};