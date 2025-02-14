import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CoinImage } from "@/components/coin/CoinImage";
import { CoinSymbol } from "@/components/coin/CoinSymbol";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PoolSchema } from "@/lib/validation/types";
import { FieldValues } from "react-hook-form";
import { formatAddress } from "@/lib/utils";

interface PreviewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    formData: FieldValues;
    selectedPools: Array<{ poolId: string; allocation: number; }>;
    poolData?: { pools: PoolSchema[] };
    isLoading?: boolean;
    onCreateCurator: (data: FieldValues) => void;
}

export const PreviewDialogCurator: React.FC<PreviewDialogProps> = ({
    isOpen,
    onClose,
    formData,
    selectedPools,
    poolData,
    isLoading,
    onCreateCurator
}) => {
    const handleCreate = () => {
        onCreateCurator(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create Curator</DialogTitle>
                    <DialogDescription>
                        Review your curator configuration and click Create to proceed.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh]">
                    <div className="space-y-4 p-1">
                        {/* Basic Information */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Basic Information</h3>
                            <div className="grid grid-cols-2 gap-2 p-3 bg-secondary/20 rounded-lg">
                                <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="font-medium">{formData._name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Symbol</p>
                                    <p className="font-medium">{formData._symbol}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Asset Configuration</h3>
                            <div className="p-3 bg-secondary/20 rounded-lg">
                                <p className="text-sm text-muted-foreground">Asset Address</p>
                                <p className="font-medium break-all">{formData && formatAddress(formData._asset, 6)}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Pool Allocations</h3>
                            <Alert>
                                <AlertDescription>
                                    Total Allocation: {selectedPools.reduce((sum, pool) => sum + pool.allocation, 0)}%
                                </AlertDescription>
                            </Alert>
                            <div className="space-y-2">
                                {selectedPools.map((selectedPool) => {
                                    const pool = poolData?.pools.find(p => p.id === selectedPool.poolId);
                                    return (
                                        <div key={selectedPool.poolId} className="p-3 bg-secondary/20 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CoinImage address={pool?.collateralToken.collateralToken ?? ""} />
                                                <CoinSymbol address={pool?.collateralToken.collateralToken ?? ""} />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm text-muted-foreground">Pool ID</p>
                                                <p className="font-medium">{formatAddress(selectedPool.poolId, 6)}</p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm text-muted-foreground">Allocation</p>
                                                <p className="font-medium">{selectedPool.allocation}%</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter className="flex flex-row gap-2 w-full sm:justify-between">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Curator"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};