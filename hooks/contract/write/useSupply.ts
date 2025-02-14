import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { writeContract, waitForTransactionReceipt } from "wagmi/actions";
import { mockArteABI } from "@/lib/abi/mockArteABI";
import { useState } from "react";
import { ADDRESS_ARTE } from "@/constants/config";
import { config } from "@/lib/wagmi";

export const useSupply = () => {
    const [steps, setSteps] = useState<
        Array<{
            step: number;
            status: "idle" | "loading" | "success" | "error";
            error?: string;
        }>
    >([
        { step: 1, status: "idle" },
    ]);

    const [txHash, setTxHash] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: async ({
            id,
            amount,
            onBehalfOf,
        }: {
            id: string;
            amount: string;
            onBehalfOf: string;
        }) => {
            try {
                // Reset steps
                setSteps([{ step: 1, status: "idle" }]);

                if (!id || !amount || !onBehalfOf) {
                    throw new Error("Invalid parameters");
                }

                // Step 1: Supply
                setSteps((prev) =>
                    prev.map((item) => {
                        if (item.step === 1) {
                            return { ...item, status: "loading" };
                        }
                        return item;
                    })
                );

                const supplyTxHash = await writeContract(config, {
                    abi: mockArteABI,
                    address: ADDRESS_ARTE,
                    functionName: "supply",
                    args: [id, BigInt(amount), onBehalfOf as string],
                });

                setTxHash(supplyTxHash);

                const supplyReceipt = await waitForTransactionReceipt(config, {
                    hash: supplyTxHash,
                });

                if (supplyReceipt.status === "success") {
                    setSteps((prev) =>
                        prev.map((item) => {
                            if (item.step === 1) {
                                return { ...item, status: "success" };
                            }
                            return item;
                        })
                    );
                    toast.success("Supply successfully!");
                } else {
                    throw new Error("Supply transaction failed");
                }

                return supplyReceipt;
            } catch (error) {
                console.error("Transaction error:", error);

                setSteps((prev) =>
                    prev.map((step) => {
                        if (step.status === "loading") {
                            return {
                                ...step,
                                status: "error",
                                error:
                                    error instanceof Error
                                        ? error.message
                                        : "An error occurred",
                            };
                        }
                        return step;
                    })
                );

                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Transaction failed. Please try again."
                );
                throw error;
            }
        },
    });

    return { steps, mutation, txHash };
};
