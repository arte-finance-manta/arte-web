import { ADDRESS_MOCK_MANTA, ADDRESS_MOCK_USDT } from "@/constants/config";
import { normalize } from "@/lib/helper/bignumber";
import { erc20Abi } from "viem";
import { useReadContract } from "wagmi";

export const useERC20Balance = (
    address: HexAddress,
    tokenAddress: HexAddress
) => {
    const findTokenAddress = tokenAddress.toLowerCase() === ADDRESS_MOCK_MANTA.toLowerCase() ? ADDRESS_MOCK_MANTA : ADDRESS_MOCK_USDT

    const { data, isLoading: balanceLoading, error: balanceError } = useReadContract({
        abi: erc20Abi,
        address: findTokenAddress,
        functionName: "balanceOf",
        args: [
            address as HexAddress
        ],
        query: {
            refetchInterval: 3000
        }
    });

    const balance = data && (data as bigint).toString()
    const bNormalized = normalize(Number(data), 6)

    return {
        balance,
        balanceLoading,
        balanceError,
        bNormalized
    };
};