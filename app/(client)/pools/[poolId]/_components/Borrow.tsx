"use client"

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { AlchemyNftSchema, PoolSchema } from "@/lib/validation/types";
import { LoadingTransaction } from "@/components/loader/LoadingTransaction";
import { SuccessDialog } from "@/components/dialog/SuccessDialog";
import { useBorrow } from "@/hooks/contract/write/useBorrow";
import { CoinImage } from "@/components/coin/CoinImage";
import { toast } from "sonner";

interface BorrowProps {
    filteredData?: PoolSchema;
    nftData?: AlchemyNftSchema
}

interface BorrowValues {
    borrowAmount: string;
}

export default function Borrow({
    filteredData,
    nftData
}: BorrowProps) {
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const {
        steps,
        mutation,
        txHash
    } = useBorrow();

    const form = useForm<BorrowValues>({
        defaultValues: {
            borrowAmount: ""
        }
    });

    const handleSubmit = async (data: BorrowValues) => {
        if (!filteredData && !nftData) { 
            return; 
        }

        mutation.mutate(
            {
                poolId: filteredData?.id as string,
                amount: data.borrowAmount,
                tokenId: nftData?.tokenId as string
            },
            {
                onSuccess: (data) => {
                    setShowSuccessDialog(true);
                    form.reset();
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
                txHash={txHash as HexAddress || ""}
                processName="Borrow"
            />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5">
                    <Card className="w-full p-5">
                        <CardContent className="flex flex-col gap-5 p-0">
                            <div className="flex flex-row justify-between items-center">
                                <Label>Borrow</Label>
                            </div>
                            <FormField
                                control={form.control}
                                name="borrowAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    className="w-full pr-10 py-7 rounded-xl"
                                                    type="number"
                                                    min={0}
                                                    placeholder="Enter borrow amount"
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

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={mutation.isPending}
                            >
                                Borrow
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