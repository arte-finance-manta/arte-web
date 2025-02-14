import { ADDRESS_ARTE } from "@/constants/config";
import { mockArteABI } from "@/lib/abi/mockArteABI";
import { denormalize } from "@/lib/helper/bignumber";
import { config } from "@/lib/wagmi";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { encodeFunctionData, erc721Abi } from "viem";
import { useAccount } from "wagmi";
import {
  readContract,
  sendTransaction,
  waitForTransactionReceipt,
  writeContract,
} from "wagmi/actions";

export const useSupplyCollateralAndBorrow = () => {
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
    {
      step: 2,
      status: "idle",
    },
    {
      step: 3,
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
        // Reset steps
        setSteps([
          { step: 1, status: "idle" },
          { step: 2, status: "idle" },
        ]);

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

        const getPoolData = await readContract(config, {
          address: ADDRESS_ARTE,
          abi: mockArteABI,
          functionName: "pools",
          args: [poolId],
        });

        const collateralTokenAddress = (
          getPoolData as unknown as any[]
        )[0] as HexAddress;

        const allowanceData = await readContract(config, {
          address: collateralTokenAddress as HexAddress,
          abi: erc721Abi,
          functionName: "isApprovedForAll",
          args: [userAddress, ADDRESS_ARTE as HexAddress],
        });

        if (allowanceData !== undefined) {
          if (!allowanceData) {
            const data = encodeFunctionData({
              abi: erc721Abi,
              functionName: "setApprovalForAll",
              args: [ADDRESS_ARTE as HexAddress, true],
            });

            // Send tx
            const txHash = await sendTransaction(config, {
              to: collateralTokenAddress as HexAddress,
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

        // Step 2: Perform deposit
        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 2) {
              return { ...item, status: "loading" };
            }
            return item;
          })
        );

        const txHash = await writeContract(config, {
          address: ADDRESS_ARTE,
          abi: mockArteABI,
          functionName: "supplyCollateralAndBorrow",
          args: [
            poolId,
            BigInt(tokenId),
            denormalizeUserAmount,
            userAddress as HexAddress,
            userAddress as HexAddress,
          ],
        });
        setTxHash(txHash);
        const result = await waitForTransactionReceipt(config, {
          hash: txHash,
        });

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 2) {
              return { ...item, status: "success" };
            }
            return item;
          })
        );

        return result;
      } catch (e) {
        console.error("Error", e);
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
