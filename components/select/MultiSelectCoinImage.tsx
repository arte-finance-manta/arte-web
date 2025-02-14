import React from "react";
import { CheckCircle } from "lucide-react";
import { FormControl } from "@/components/ui/form";
import { PoolSchema } from "@/lib/validation/types";
import { CoinImageCustom } from "../coin/CoinImageCustom";

interface MultiSelectCoinImageProps {
    data?: PoolSchema[];
    value?: string[];
    onChange?: (
        value: Array<{ poolId: string; allocation: number }> |
        ((current: Array<{ poolId: string; allocation: number }>) => Array<{ poolId: string; allocation: number }>)
    ) => void;
}

const MultiSelectCoinImage: React.FC<MultiSelectCoinImageProps> = ({
    data = [],
    value = [],
    onChange
}) => {
    const handleClick = (poolId: string) => {
        if (!onChange) return;
    
        onChange((current: Array<{ poolId: string; allocation: number }>) => {
            if (value.includes(poolId)) {
                return current.filter(pool => pool.poolId !== poolId);
            } else {
                return [...current, { poolId, allocation: 0 }];
            }
        });
    };    

    const isSelected = (poolId: string) => value.includes(poolId);

    return (
        <FormControl>
            <div className="flex flex-wrap gap-4 p-4">
                {data?.map((pool) => (
                    <div
                        key={pool.id}
                        className="relative cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95"
                        onClick={() => pool.id && handleClick(pool.id)}
                    >
                        <div className={`
                            relative rounded-full overflow-hidden transition-all duration-200
                            ${isSelected(pool.id!) ? "ring-4 ring-gray-400 dark:ring-white" : "ring-1 ring-gray-200 hover:ring-primary/50"}
                        `}>
                            <CoinImageCustom
                                address={pool.collateralToken.collateralToken || ""}
                                className="w-20 h-20 object-cover brightness-90"
                            />

                            {isSelected(pool.id!) && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-white" />
                                </div>
                            )}
                        </div>

                        <div className={`
                            mt-2 text-center text-sm font-medium truncate max-w-[80px]
                            ${isSelected(pool.id!) ? "text-primary" : "text-gray-600"}
                        `}>
                            Pool {pool.id?.slice(0, 6)}...
                        </div>
                    </div>
                ))}
            </div>
        </FormControl>
    );
};

export default MultiSelectCoinImage;