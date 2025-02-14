import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CoinImage } from "@/components/coin/CoinImage";
import { CoinSymbol } from "@/components/coin/CoinSymbol";
import SkeletonWrapper from "@/components/loader/SkeletonWrapper";
import { PoolSchema } from "@/lib/validation/types";
import MultiSelectCoinImage from "@/components/select/MultiSelectCoinImage";
import ValidationError from "@/components/error/validation-error";

interface StepProps {
    form: UseFormReturn;
    validationError: string | null;
    activeStep: number;
    isAnimating: boolean;
    selectedPools: Array<{ poolId: string; allocation: number; }>;
    setSelectedPools: React.Dispatch<React.SetStateAction<Array<{ poolId: string; allocation: number; }>>>;
    totalAllocation: number;
    setTotalAllocation: React.Dispatch<React.SetStateAction<number>>;
    poolData?: { pools: PoolSchema[] };
    isPoolsLoading: boolean;
}

export const CreateCuratorSteps: React.FC<StepProps> = ({
    form,
    validationError,
    activeStep,
    isAnimating,
    selectedPools,
    setSelectedPools,
    totalAllocation,
    setTotalAllocation,
    poolData,
    isPoolsLoading
}) => {
    const handlePoolSelection = (
        valueOrUpdater: Array<{ poolId: string; allocation: number; }> |
            ((current: Array<{ poolId: string; allocation: number; }>) => Array<{ poolId: string; allocation: number; }>)
    ) => {
        const newSelectedPools = typeof valueOrUpdater === "function"
            ? valueOrUpdater(selectedPools)
            : valueOrUpdater;

        setSelectedPools(newSelectedPools);

        const newPoolIds = newSelectedPools.map(pool => pool.poolId);
        const newAllocations = newSelectedPools.map(pool => pool.allocation);

        form.setValue("pools", newPoolIds);
        form.setValue("allocations", newAllocations);
        updateTotalAllocation(newAllocations);
    };

    const handleRemovePool = (poolId: string) => {
        const newSelectedPools = selectedPools.filter(p => p.poolId !== poolId);
        setSelectedPools(newSelectedPools);

        const newPoolIds = newSelectedPools.map(pool => pool.poolId);
        const newAllocations = newSelectedPools.map(pool => pool.allocation);

        form.setValue("pools", newPoolIds);
        form.setValue("allocations", newAllocations);
        updateTotalAllocation(newAllocations);
    };

    const updateTotalAllocation = (allocations: number[]) => {
        const total = allocations.reduce((sum, allocation) => sum + (allocation || 0), 0);
        setTotalAllocation(total);
    };

    const handleAllocationChange = (value: number, index: number) => {
        const currentAllocations = form.getValues("allocations");
        const newAllocations = [...currentAllocations];

        const otherAllocationsTotal = currentAllocations.reduce((sum: number, allocation: number, i: number) =>
            i !== index ? sum + (allocation || 0) : sum, 0);
        const maxAllowedAllocation = 100 - otherAllocationsTotal;

        const clampedValue = Math.min(Math.max(0, value), maxAllowedAllocation);
        newAllocations[index] = clampedValue;

        form.setValue(`allocations.${index}`, clampedValue);
        setSelectedPools(current =>
            current.map((pool, i) =>
                i === index ? { ...pool, allocation: clampedValue } : pool
            )
        );
        updateTotalAllocation(newAllocations);
    };

    return (
        <div className={`transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
            {activeStep === 0 && (
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter curator name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter the curator name
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="_symbol"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Symbol</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter curator symbol" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter the curator symbol
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <ValidationError message={validationError} />
                </div>
            )}

            {activeStep === 1 && (
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="_asset"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Asset</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter asset address" onChange={
                                        (e) => {
                                            form.setValue("_asset", e.target.value);
                                        }
                                    } />
                                </FormControl>
                                <FormDescription>
                                    Enter the asset contract address
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <ValidationError message={validationError} />
                </div>
            )}

            {activeStep === 2 && (
                <div className="space-y-4">
                    <FormItem>
                        <FormLabel>Pool Selection</FormLabel>
                        <SkeletonWrapper isLoading={isPoolsLoading}>
                            <MultiSelectCoinImage
                                data={poolData?.pools}
                                onChange={handlePoolSelection}
                                value={selectedPools.map(p => p.poolId)}
                            />
                        </SkeletonWrapper>
                    </FormItem>

                    {selectedPools.length > 0 && (
                        <Alert>
                            <AlertDescription>
                                Total Allocation: {totalAllocation}% | Remaining: {100 - totalAllocation}%
                            </AlertDescription>
                        </Alert>
                    )}
                    <SkeletonWrapper isLoading={isPoolsLoading}>
                        {selectedPools.map((selectedPool, index) => {
                            const pool = poolData?.pools.find(p => p.id === selectedPool.poolId);
                            return (
                                <div key={selectedPool.poolId} className="relative p-4 border rounded-lg">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-2 top-2"
                                        onClick={() => handleRemovePool(selectedPool.poolId)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <div className="flex items-center gap-2 mb-2">
                                        <CoinImage address={pool?.collateralToken.collateralToken ?? ""} />
                                        <CoinSymbol address={pool?.collateralToken.collateralToken ?? ""} />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name={`allocations.${index}`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Allocation Percentage</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        step="0.1"
                                                        placeholder="Enter allocation percentage"
                                                        value={field.value || "0"}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value);
                                                            handleAllocationChange(value, index);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            );
                        })}
                    </SkeletonWrapper>
                    <ValidationError message={validationError} />
                </div>
            )}
        </div>
    );
};