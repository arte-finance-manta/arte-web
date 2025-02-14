"use client"

import React, { useState } from "react";
import { Wallet } from "lucide-react";
import { useForm } from "react-hook-form";
import { CoinImage } from "@/components/coin/CoinImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { PoolSchema } from "@/lib/validation/types";
import { LoadingTransaction } from "@/components/loader/LoadingTransaction";
import { SuccessDialog } from "@/components/dialog/SuccessDialog";
import { useAccount } from "wagmi";
import { useWithdraw } from "@/hooks/contract/write/useWithdraw";
import { toast } from "sonner";
import { useERC20Balance } from "@/hooks/contract/useERC20Balance";
import { normalize } from "@/lib/helper/bignumber";

interface WithdrawProps {
    filteredData?: PoolSchema;
}

interface WithdrawValues {
    withdrawAmount: string;
}

export default function Withdraw({
    filteredData
}: WithdrawProps) {
    const { address } = useAccount();
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const loanTokenAddress = filteredData?.loanToken.loanToken?.startsWith("0x")
        ? filteredData.loanToken.loanToken as HexAddress
        : "" as HexAddress;

    const { balance } = useERC20Balance(address as HexAddress, loanTokenAddress);
    const normalizeBalance = normalize(balance?.toString() ?? "0", 18);

    const {
        mutation,
        txHash
    } = useWithdraw();

    const form = useForm<WithdrawValues>({
        defaultValues: {
            withdrawAmount: ""
        }
    });

    const withdrawAmount = form.watch("withdrawAmount");
    const isInsufficientBalance = parseFloat(withdrawAmount || "0") > parseFloat(normalizeBalance);

    const handleSubmit = async (data: WithdrawValues) => {
        if (!address) {
            toast.error("Connect wallet first");
            return;
        }

        if (!filteredData) {
            toast.error("No pool data available");
            return;
        }

        if (isInsufficientBalance) {
            return;
        }

        mutation.mutate(
            {
                id: filteredData?.id || "",
                shares: (Number(data.withdrawAmount)*1e6).toString(),
                onBehalfOf: address as HexAddress,
                userAddress: address as HexAddress
            },
            {
                onSuccess: () => {
                    setShowSuccessDialog(true);
                    form.reset();
                },
                onError: (error) => {
                    const errorMessage = error instanceof Error
                        ? error.message
                        : 'An unknown error occurred';
                    toast.error(`Error withdrawing: ${errorMessage}`);
                    console.error("Error withdrawing:", error);
                },
            }
        );
    };

    const handleMaxWithdraw = () => {
        form.setValue("withdrawAmount", normalizeBalance?.toString() ?? "0");
    };

    if (!filteredData) {
        return (
            <Card className="w-full p-5">
                <CardContent className="flex justify-center items-center p-4">
                    <Label>No pool data available</Label>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            {mutation.isPending && <LoadingTransaction message="Withdrawing..." />}
            <SuccessDialog
                isOpen={showSuccessDialog}
                onClose={() => setShowSuccessDialog(false)}
                txHash={txHash as HexAddress || ""}
                processName="Withdraw"
            />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5">
                    <Card className="w-full p-5">
                        <CardContent className="flex flex-col gap-5 p-0">
                            <div className="flex flex-row justify-between items-center">
                                <Label>Withdraw</Label>
                                <div className="flex flex-row gap-2 items-center">
                                    <Wallet />
                                    <Label>{parseFloat(normalizeBalance).toFixed(2)}</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="cursor-pointer px-3"
                                        onClick={handleMaxWithdraw}
                                    >
                                        <Label className="text-[11px] cursor-pointer">Max</Label>
                                    </Button>
                                </div>
                            </div>
                            <FormField
                                control={form.control}
                                name="withdrawAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    aria-label="Withdraw Amount"
                                                    className="w-full pr-10 py-7 rounded-xl"
                                                    type="number"
                                                    min={0}
                                                    step="0.01"
                                                    value={field.value}
                                                    placeholder="Enter withdraw amount"
                                                />
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-fit">
                                                    <CoinImage address={filteredData?.loanToken.loanToken || ""} />
                                                </div>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {isInsufficientBalance && (
                                <Label className="text-red-600">
                                    Insufficient balance. The amount exceeds your available funds.
                                </Label>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={
                                    mutation.isPending ||
                                    isInsufficientBalance ||
                                    form.watch("withdrawAmount") === ""
                                }
                            >
                                Withdraw
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
                                    <Label className="text-textSecondary">Liquidation Price</Label>
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