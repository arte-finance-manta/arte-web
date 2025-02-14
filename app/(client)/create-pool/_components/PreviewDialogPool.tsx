import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { poolSchema } from "@/lib/validation/schemas";
import { CoinMarketCapSchema } from "@/lib/validation/types";
import { formatAddress } from "@/lib/utils";
import { CoinSymbol } from "@/components/coin/CoinSymbol";
import { CoinImage } from "@/components/coin/CoinImage";

type FormData = z.infer<typeof poolSchema>;

interface PreviewDialogPoolProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    formData: FormData;
    oracleData?: CoinMarketCapSchema[];
    isLoading: boolean;
}

const PreviewDialogPool: React.FC<PreviewDialogPoolProps> = ({
    isOpen,
    onClose,
    onConfirm,
    formData,
    isLoading
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Preview Pool Creation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Card className="bg-secondary/20">
                        <CardContent className="pt-6">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Collateral Token:</span>
                                    <div className="flex flex-row gap-2 items-center">
                                        <CoinSymbol address={formData.collateralAddress || ""} />
                                        <CoinImage address={formData.collateralAddress || ""} />
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Loan Token:</span>
                                    <div className="flex flex-row gap-2 items-center">
                                        <CoinSymbol address={formData.loanAddress || ""} />
                                        <CoinImage address={formData.loanAddress || ""} />
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Oracle:</span>
                                    <div className="flex flex-row gap-1 items-center">
                                        {formData && formatAddress(formData.oracle || "", 4)}
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Interest Rate Model:</span>
                                    <span className="font-medium truncate max-w-[200px]" title={formData.irm || ""}>
                                        {formData && formatAddress(formData.irm || "", 4)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">LTV:</span>
                                    <span className="font-medium">{formData.ltv}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">LTH:</span>
                                    <span className="font-medium">{formData.lth}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <DialogFooter className="flex sm:justify-between">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        Create Pool
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PreviewDialogPool;