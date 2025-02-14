import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { writeContract, waitForTransactionReceipt, readContract, sendTransaction } from "wagmi/actions";
import { mockCuratorABI } from "@/lib/abi/mockCuratorABI";
import { useState } from "react";
import { config } from "@/lib/wagmi";
import { useAccount } from "wagmi";
import { denormalize } from "@/lib/helper/bignumber";
import { encodeFunctionData, erc20Abi } from "viem";

export const useDepositCurator = (assetCuratorAddress: HexAddress, curatorAddress: HexAddress) => {
  const { address } = useAccount();

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
    mutationFn: async ({ amount, decimal, tokenAddress }: { amount: string, decimal: number, tokenAddress: HexAddress }) => {
      try {
        // Reset steps
        setSteps([
          { step: 1, status: "idle" },
          { step: 2, status: "idle" },
        ]);

        if (!amount) {
          throw new Error("Invalid amount");
        }

        const denormalizeUserAmount = denormalize(amount || "0", decimal);
        const baseAmount = BigInt(denormalizeUserAmount);
        const additionalAmount = (baseAmount * BigInt(2)) / BigInt(100);
        const userInputBn = baseAmount + additionalAmount;

        // Step 1: Approve contract
        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "loading" };
            }
            return item;
          })
        );

        const allowanceData = await readContract(config, {
          address: tokenAddress as HexAddress,
          abi: erc20Abi,
          functionName: "allowance",
          args: [address as HexAddress, curatorAddress],
        });

        if (allowanceData !== undefined) {
          if (
            (allowanceData === BigInt(0) || allowanceData < userInputBn) &&
            userInputBn !== BigInt(0)
          ) {
            const data = encodeFunctionData({
              abi: erc20Abi,
              functionName: "approve",
              args: [curatorAddress, userInputBn],
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

        // Step 2: Deposit to curator
        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 2) {
              return { ...item, status: "loading" };
            }
            return item;
          })
        );

        const depositTxHash = await writeContract(config, {
          abi: mockCuratorABI,
          address: curatorAddress,
          functionName: "deposit",
          args: [BigInt(denormalizeUserAmount), assetCuratorAddress as HexAddress],
        });

        setTxHash(depositTxHash);

        const depositReceipt = await waitForTransactionReceipt(config, { hash: depositTxHash });

        if (depositReceipt.status === "success") {
          setSteps((prev) =>
            prev.map((item) => {
              if (item.step === 2) {
                return { ...item, status: "success" };
              }
              return item;
            })
          );
          toast.success("Deposit curator successfully!");
        } else {
          throw new Error("Deposit transaction failed");
        }

        return depositReceipt;
      } catch (error) {
        console.error("Transaction error:", error);

        setSteps((prev) =>
          prev.map((step) => {
            if (step.status === "loading") {
              return {
                ...step,
                status: "error",
                error: error instanceof Error ? error.message : "An error occurred",
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