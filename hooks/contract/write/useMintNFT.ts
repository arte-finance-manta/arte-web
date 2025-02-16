import { useState } from "react";
import { toast } from "sonner";
import { waitForTransactionReceipt, writeContract, readContract } from "wagmi/actions";
import { listIP } from "@/constants/config";
import { config } from "@/lib/wagmi";
import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { mockIPABI } from "@/lib/abi/mockIPABI";

export const useMintNFT = () => {
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
    mutationFn: async ({
        id,
    }: {
        id: string;
    }) => {
      try {
        // Reset steps
        setSteps([
          { step: 1, status: "idle" },
          { step: 2, status: "idle" },
        ]);

        setSteps((prev) =>
          prev.map((item) => (item.step === 1 ? { ...item, status: "loading" } : item))
        );

        const result: any = await readContract(config, {
          abi: mockIPABI,
          address: listIP[0] as HexAddress,
          functionName: "listAllToken"
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const listIds = result.map((item: any) => Number(item));

        let newNumber = 1;
        while (listIds.includes(newNumber)) {
          newNumber++;
        }

        const hash = await writeContract(config, {
          abi: mockIPABI,
          address: listIP[0] as HexAddress,
          functionName: "mint",
          args: [address, BigInt(newNumber)],
        });

        setTxHash(hash);

        setSteps((prev) =>
          prev.map((item) => (item.step === 1 ? { ...item, status: "success" } : item))
        );

        setSteps((prev) =>
          prev.map((item) => (item.step === 2 ? { ...item, status: "loading" } : item))
        );

        const receipt = await waitForTransactionReceipt(config, { hash });

        if (receipt) {
          setSteps((prev) =>
            prev.map((item) => (item.step === 2 ? { ...item, status: "success" } : item))
          );
          toast.success("Mint successfully!");
          window.location.reload();
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
                error: error instanceof Error ? error.message : "Transaction failed."
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