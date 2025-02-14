import { ADDRESS_MOCK_USDC, ADDRESS_MOCK_USDT } from "@/constants/config";
import { normalize } from "@/lib/helper/bignumber";
import { erc20Abi } from "viem";
import { useReadContract } from "wagmi";

export const useERC20Balance = (
    address: HexAddress,
    tokenAddress: HexAddress
) => {
    const findTokenAddress = tokenAddress.toLowerCase() === ADDRESS_MOCK_USDC.toLowerCase() ? ADDRESS_MOCK_USDC : ADDRESS_MOCK_USDT

    const { data, isLoading: balanceLoading, error: balanceError } = useReadContract({
        abi: erc20Abi,
        address: findTokenAddress,
        functionName: "balanceOf",
        args: [
            address as HexAddress
        ],
    });

    const balance = data && (data as bigint).toString()

    return {
        balance,
        balanceLoading,
        balanceError
    };
};