import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { writeContract, waitForTransactionReceipt } from "wagmi/actions";
import { mockArteABI } from "@/lib/abi/mockArteABI";
import { useState } from "react";
import { ADDRESS_ARTE } from "@/constants/config";
import { config } from "@/lib/wagmi";

export const useSettleAuction = () => {
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
        mutationFn: async ({ id, tokenId }: { id: string; tokenId: string }) => {
            try {
                // Reset steps
                setSteps([{ step: 1, status: "idle" }]);

                if (!id || !tokenId) {
                    throw new Error("Invalid parameters");
                }

                // Step 1: Settle Auction
                setSteps((prev) =>
                    prev.map((item) => {
                        if (item.step === 1) {
                            return { ...item, status: "loading" };
                        }
                        return item;
                    })
                );

                const settleAuctionTxHash = await writeContract(config, {
                    abi: mockArteABI,
                    address: ADDRESS_ARTE,
                    functionName: "settleAuction",
                    args: [id, BigInt(tokenId)],
                });

                setTxHash(settleAuctionTxHash);

                const settleAuctionReceipt = await waitForTransactionReceipt(config, {
                    hash: settleAuctionTxHash,
                });

                if (settleAuctionReceipt.status === "success") {
                    setSteps((prev) =>
                        prev.map((item) => {
                            if (item.step === 1) {
                                return { ...item, status: "success" };
                            }
                            return item;
                        })
                    );
                    toast.success("Settle Auction successfully!");
                } else {
                    throw new Error("Settle Auction transaction failed");
                }

                return settleAuctionReceipt;
            } catch (error) {
                console.error("Transaction error:", error);

                setSteps((prev) =>
                    prev.map((step) => {
                        if (step.status === "loading") {
                            return {
                                ...step,
                                status: "error",
                                error:
                                    error instanceof Error ? error.message : "An error occurred",
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
