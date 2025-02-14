import { useState } from "react";
import { toast } from "sonner";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { mockCuratorABI } from "@/lib/abi/mockCuratorABI";
import { config } from "@/lib/wagmi";
import { useMutation } from "@tanstack/react-query";
import { denormalize } from "@/lib/helper/bignumber";

export const useWithdrawCurator = (curatorAddress: string) => {
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

  const mutation = useMutation({
    mutationFn: async ({
      amount,
      userAddress,
      decimal,
      assetCurator
    }: {
      amount: string;
      userAddress: string;
      decimal: number;
      assetCurator: HexAddress;
    }) => {
      try {
        // Reset steps
        setSteps([
          { step: 1, status: "idle" },
          { step: 2, status: "idle" },
        ]);

        const denormalizeUserAmount = denormalize(amount || "0", decimal);

        // Step 1: Initiate the withdraw transaction
        setSteps((prev) =>
          prev.map((item) => (item.step === 1 ? { ...item, status: "loading" } : item))
        );

        const hash = await writeContract(config, {
          abi: mockCuratorABI,
          address: curatorAddress as HexAddress,
          functionName: "withdraw",
          args: [BigInt(denormalizeUserAmount), userAddress, userAddress],
        });

        setTxHash(hash);

        setSteps((prev) =>
          prev.map((item) => (item.step === 1 ? { ...item, status: "success" } : item))
        );

        // Step 2: Wait for transaction confirmation
        setSteps((prev) =>
          prev.map((item) => (item.step === 2 ? { ...item, status: "loading" } : item))
        );

        const receipt = await waitForTransactionReceipt(config, { hash });

        if (receipt) {
          setSteps((prev) =>
            prev.map((item) => (item.step === 2 ? { ...item, status: "success" } : item))
          );
          toast.success("Withdraw curator successfully!");
          return receipt;
        } else {
          throw new Error("Transaction confirmation failed.");
        }
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

  return { steps, mutation, txHash };
};