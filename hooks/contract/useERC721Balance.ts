import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { erc721Abi } from "viem";
import { config } from "@/lib/wagmi";
import { Config } from "wagmi";

export const useERC721Balance = (address: HexAddress, token: HexAddress) => {
    const [balance, setBalance] = useState<bigint | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchBalance = async () => {
            setLoading(true);
            try {
                const result = await readContract(config as Config, {
                    address: token,
                    abi: erc721Abi,
                    functionName: "balanceOf",
                    args: [address],
                });
                setBalance(result);
            } catch (err: unknown) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        if (address) {
            fetchBalance();
        }
    }, [address, token]);

    return { balance, loading, error };
};