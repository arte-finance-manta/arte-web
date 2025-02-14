"use client";

import { CoinImage } from "@/components/coin/CoinImage";
import SuccessDialog from "@/components/dialog/SuccessDialog";
import { LoadingTransaction } from "@/components/loader/LoadingTransaction";
import { NftImage } from "@/components/nft/NftImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDecimal } from "@/hooks/contract/useDecimal";
import { useGetPosition } from "@/hooks/contract/useGetPosition";
import { useRepay } from "@/hooks/contract/write/useRepay";
import useCurrentAccount from "@/hooks/graphql/useCurrentAccount";
import usePools from "@/hooks/graphql/usePools";
import { denormalizeBN, normalizeBN } from "@/lib/helper/bignumber";
import { AlchemyNftSchema, PoolSchema } from "@/lib/validation/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAccount } from "wagmi";

interface RepayProps {
  filteredData?: PoolSchema;
  nftData?: AlchemyNftSchema;
}

interface RepayFormValues {
  repayAmount: string;
}

export default function Repay({ filteredData, nftData }: RepayProps) {
  const { address } = useAccount();
  const { data: positionData, refetch } = useGetPosition(
    filteredData?.id as HexAddress,
    nftData?.tokenId as HexAddress
  );
  const { refetch: refetchPools } = usePools();

  const position = positionData as [bigint, bigint];
  const currentShares = position?.[0] as bigint;
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { decimal } = useDecimal(
    (filteredData?.loanToken.loanToken as HexAddress) || ""
  );

  const calculationBorrow =
    ((Number(currentShares) || 0) /
      (Number(filteredData?.totalBorrowShares) || 0)) *
    (Number(filteredData?.totalBorrowAssets) || 0);

  const borrowedAmount = normalizeBN(
    isNaN(calculationBorrow) ? "0" : calculationBorrow,
    decimal || 6
  );

  const { mutation, txHash } = useRepay();

  const form = useForm<RepayFormValues>({
    defaultValues: {
      repayAmount: "",
    },
  });

  const handleSubmit = async (data: RepayFormValues) => {
    if (
      !filteredData?.id ||
      !nftData?.tokenId ||
      !address ||
      !data.repayAmount
    ) {
      return;
    }

    const calculationRepay =
      (parseFloat(data.repayAmount) * (filteredData?.totalBorrowShares || 0)) /
      (filteredData?.totalBorrowAssets || 0);
    const convertedInputToShare = denormalizeBN(
      isNaN(calculationRepay) ? 0 : calculationRepay,
      decimal || 6
    );

    mutation.mutate(
      {
        id: filteredData?.id as string,
        onBehalfOf: address as HexAddress,
        shares: convertedInputToShare.toString(),
        tokenId: nftData?.tokenId as string,
        decimal: decimal || 6,
        tokenUsed: data.repayAmount,
        tokenAddress: filteredData?.loanToken.loanToken as HexAddress,
      },
      {
        onSuccess: () => {
          setShowSuccessDialog(true);
          form.reset();
          refetch();
          refetchPools();
        },
        onError: (error) => {
          toast.error(`Error borrowing: ${error}`);
          console.error("Error borrowing:", error);
        },
      }
    );
  };

  if (!filteredData) {
    return (
      <Card className="w-full p-5">
        <CardContent className="flex justify-center items-center p-4">
          <Label>No data available</Label>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {mutation.isPending && <LoadingTransaction message={"Loading.."} />}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        txHash={(txHash as HexAddress) || ""}
        processName="Repay"
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-5"
        >
          <Card className="w-full p-5">
            <CardContent className="flex flex-col gap-5 p-0">
              <div className="flex flex-row justify-between items-center">
                <Label>Repay</Label>
              </div>
              <FormField
                control={form.control}
                name="repayAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          className="w-full pr-10 py-7 rounded-xl"
                          min={0}
                          step={1}
                          placeholder="Enter repay amount"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-fit cursor-pointer">
                          <CoinImage address={filteredData?.loanToken?.loanToken || ""} />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="text-textSecondary text-sm">
                You borrowed : {parseFloat(borrowedAmount.toString()).toFixed(2)}
              </p>

              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending || !form.formState.isValid}
              >
                Repay
              </Button>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardContent className="p-5 space-y-5">
              <Label className="font-bold">Transaction Overview</Label>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between">
                  <Label className="text-textSecondary">Health Factor</Label>
                  <Label>-</Label>
                </div>
                <div className="flex flex-row justify-between">
                  <Label className="text-textSecondary">
                    Liquidation Price
                  </Label>
                  <Label>$0.00</Label>
                </div>
                <div className="flex flex-row justify-between">
                  <Label className="text-textSecondary">Gas Fee</Label>
                  <Label>1</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </>
  );
}
