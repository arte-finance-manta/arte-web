import { useState } from "react";
import { toast } from "sonner";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { useMutation } from "@tanstack/react-query";
import { ADDRESS_CURATOR } from "@/constants/config";
import { curatorABI } from "@/lib/abi/curatorABI";
import { config } from "@/lib/wagmi";

export const useCreateCurator = () => {
    const [steps, setSteps] = useState<
        Array<{
            step: number;
            status: "idle" | "loading" | "success" | "error";
            error?: string;
        }>
    >([
        { step: 1, status: "idle" },
        { step: 2, status: "idle" },
    ]);

    const [txHash, setTxHash] = useState<string | null>(null);
    const [dataCurator, setDataCurator] = useState<any>(null);

    const mutation = useMutation({
        mutationFn: async ({
            _name,
            _symbol,
            _asset,
            pools,
            allocations,
        }: {
            _name: string;
            _symbol: string;
            _asset: string;
            pools: string[];
            allocations: number[];
        }) => {
            try {
                // Reset steps
                setSteps([
                    { step: 1, status: "idle" },
                    { step: 2, status: "idle" },
                ]);

                // Step 1: Deploy Curator Contract
                setSteps((prev) =>
                    prev.map((item) =>
                        item.step === 1 ? { ...item, status: "loading" } : item
                    )
                );

                const allocationsInUint256 = allocations.map((allocation) => BigInt(allocation));

                const hash = await writeContract(config, {
                    abi: curatorABI,
                    address: ADDRESS_CURATOR,
                    functionName: "deployCurator",
                    args: [_name, _symbol, _asset, pools, allocationsInUint256],
                });

                setTxHash(hash);

                setSteps((prev) =>
                    prev.map((item) =>
                        item.step === 1 ? { ...item, status: "success" } : item
                    )
                );

                // Step 2: Wait for transaction confirmation
                setSteps((prev) =>
                    prev.map((item) =>
                        item.step === 2 ? { ...item, status: "loading" } : item
                    )
                );

                const receipt = await waitForTransactionReceipt(config, { hash });

                if (receipt) {
                    setSteps((prev) =>
                        prev.map((item) =>
                            item.step === 2 ? { ...item, status: "success" } : item
                        )
                    );
                    setDataCurator(receipt);
                    toast.success("Create curator successfully!");
                } else {
                    throw new Error("Transaction confirmation failed.");
                }

                return receipt;
            } catch (error) {
                console.error("Transaction error:", error);
                setSteps((prev) =>
                    prev.map((step) => {
                        if (step.status === "loading") {
                            return {
                                ...step,
                                status: "error",
                                error: error instanceof Error ? error.message : "Transaction failed.",
                            };
                        }
                        return step;
                    })
                );
                toast.error(error instanceof Error ? error.message : "Transaction failed. Please try again.");
                throw error;
            }
        },
    });

    return { steps, mutation, txHash, dataCurator };
};