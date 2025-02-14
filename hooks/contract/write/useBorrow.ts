import { ADDRESS_ARTE } from "@/constants/config";
import { mockArteABI } from "@/lib/abi/mockArteABI";
import { denormalize } from "@/lib/helper/bignumber";
import { config } from "@/lib/wagmi";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAccount } from "wagmi";
import {
    waitForTransactionReceipt,
    writeContract,
} from "wagmi/actions";

export const useBorrow = () => {
    const { address: userAddress } = useAccount();

    const [steps, setSteps] = useState<
        Array<{
            step: number;
            status: Status;
            error?: string;
        }>
    >([
        {
            step: 1,
            status: "idle",
        },
    ]);

    const [txHash, setTxHash] = useState<HexAddress | null>(null);

    const mutation = useMutation({
        mutationFn: async ({
            poolId,
            tokenId,
            amount,
        }: {
            poolId: string;
            tokenId: string;
            amount: string;
        }) => {
            try {
                setSteps([{ step: 1, status: "idle" }]);

                if (!amount || !userAddress) {
                    throw new Error("Invalid parameters");
                }

                const denormalizeUserAmount = denormalize(amount || "0", 6);

                setSteps((prev) =>
                    prev.map((item) => {
                        if (item.step === 1) {
                            return { ...item, status: "loading" };
                        }
                        return item;
                    })
                );

                const txHash = await writeContract(config, {
                    address: ADDRESS_ARTE,
                    abi: mockArteABI,
                    functionName: "borrow",
                    args: [
                        poolId,
                        BigInt(tokenId),
                        denormalizeUserAmount,
                        userAddress as HexAddress,
                        userAddress as HexAddress
                    ],
                });

                setTxHash(txHash);

                const result = await waitForTransactionReceipt(config, {
                    hash: txHash,
                });

                setSteps((prev) =>
                    prev.map((item) => {
                        if (item.step === 1) {
                            return { ...item, status: "success" };
                        }
                        return item;
                    })
                );

                return result;
            } catch (e) {
                console.error("Borrow Error", e);

                setSteps((prev) =>
                    prev.map((step) => {
                        if (step.status === "loading") {
                            return { ...step, status: "error", error: (e as Error).message };
                        }
                        return step;
                    })
                );

                throw e;
            }
        },
    });

    return { steps, mutation, txHash };
};