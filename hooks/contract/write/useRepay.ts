import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  writeContract,
  waitForTransactionReceipt,
  readContract,
  sendTransaction,
} from "wagmi/actions";
import { mockArteABI } from "@/lib/abi/mockArteABI";
import { useState } from "react";
import { ADDRESS_ARTE } from "@/constants/config";
import { config } from "@/lib/wagmi";
import { erc20Abi, encodeFunctionData } from "viem";
import { denormalize } from "@/lib/helper/bignumber";

export const useRepay = () => {
  const [steps, setSteps] = useState<
    Array<{
      step: number;
      status: "idle" | "loading" | "success" | "error";
      error?: string;
    }>
  >([{ step: 1, status: "idle" }]);

  const [txHash, setTxHash] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async ({
      id,
      tokenId,
      shares,
      onBehalfOf,
      decimal,
      tokenUsed,
      tokenAddress,
    }: {
      id: string;
      tokenId: string;
      shares: string;
      onBehalfOf: string;
      decimal: number;
      tokenUsed: string;
      tokenAddress: HexAddress;
    }) => {
      try {
        // Reset steps
        setSteps([{ step: 1, status: "idle" }]);

        if (!id || !tokenId || !shares || !onBehalfOf) {
          throw new Error("Invalid parameters");
        }
        // Calculate original amount plus 2%
        const denormalizeUserAmount = denormalize(tokenUsed || "0", decimal);
        const baseAmount = BigInt(denormalizeUserAmount);
        const additionalAmount = (baseAmount * BigInt(2)) / BigInt(100);
        const userInputBn = baseAmount + additionalAmount;

        const allowanceData = await readContract(config, {
          address: tokenAddress as HexAddress,
          abi: erc20Abi,
          functionName: "allowance",
          args: [onBehalfOf as HexAddress, ADDRESS_ARTE],
        });

        if (allowanceData !== undefined) {
          if (
            (allowanceData === BigInt(0) || allowanceData < userInputBn) &&
            userInputBn !== BigInt(0)
          ) {
            const data = encodeFunctionData({
              abi: erc20Abi,
              functionName: "approve",
              args: [ADDRESS_ARTE, userInputBn],
            });

            // Send tx
            const txHash = await sendTransaction(config, {
              to: tokenAddress as HexAddress,
              data,
            });
            const receipt = await waitForTransactionReceipt(config, {
              hash: txHash,
            });
            if (receipt) {
              setSteps((prev) =>
                prev.map((item) => {
                  if (item.step === 1) {
                    return { ...item, status: "success" };
                  }
                  return item;
                })
              );
            }
          } else {
            setSteps((prev) =>
              prev.map((item) => {
                if (item.step === 1) {
                  return { ...item, status: "success" };
                }
                return item;
              })
            );
          }
        }

        // Step 1: Repay
        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "loading" };
            }
            return item;
          })
        );

        const repayTxHash = await writeContract(config, {
          abi: mockArteABI,
          address: ADDRESS_ARTE,
          functionName: "repay",
          args: [id, BigInt(tokenId), BigInt(shares), onBehalfOf as HexAddress],
        });

        setTxHash(repayTxHash);

        const repayReceipt = await waitForTransactionReceipt(config, {
          hash: repayTxHash,
        });

        if (repayReceipt.status === "success") {
          setSteps((prev) =>
            prev.map((item) => {
              if (item.step === 1) {
                return { ...item, status: "success" };
              }
              return item;
            })
          );
          toast.success("Repay successfully!");
        } else {
          throw new Error("Repay transaction failed");
        }

        return repayReceipt;
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
