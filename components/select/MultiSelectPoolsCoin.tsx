import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CoinImage } from "@/components/coin/CoinImage";
import { CoinSymbol } from "@/components/coin/CoinSymbol";
import { PoolSchema } from "@/lib/validation/types";

interface MultiSelectPoolsCoinProps {
    data: PoolSchema[];
    value: string[];
    onChange: (value: PoolSchema[]) => void;
}

const MultiSelectPoolsCoin: React.FC<MultiSelectPoolsCoinProps> = ({
    data,
    value,
    onChange
}) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (pool: PoolSchema) => {
        const isSelected = value.includes(pool.id || "");
        let newValue: string[];

        if (isSelected) {
            newValue = value.filter(id => id !== pool.id);
        } else {
            newValue = [...value, pool.id || ""];
        }

        // Convert selected IDs back to pool objects
        const selectedPools = data.filter(pool => newValue.includes(pool.id || ""));
        onChange(selectedPools);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between py-6"
                >
                    {value.length === 0 ? (
                        <span className="text-muted-foreground">Select pools...</span>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {value.map((id) => {
                                const pool = data.find(p => p.id === id);
                                return pool ? (
                                    <Badge
                                        variant="secondary"
                                        key={pool.id}
                                        className="flex items-center gap-1"
                                    >
                                        <CoinImage address={pool.collateralToken.collateralToken || ""} />
                                        <CoinSymbol address={pool.collateralToken.collateralToken || ""} />
                                        <span>{pool.ltv}% LTV</span>
                                    </Badge>
                                ) : null;
                            })}
                        </div>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search pools..." />
                    <CommandEmpty>No pools found.</CommandEmpty>
                    <CommandGroup>
                        <ScrollArea className="h-64">
                            {data.map((pool) => (
                                <CommandItem
                                    key={pool.id}
                                    value={pool.id!}
                                    onSelect={() => handleSelect(pool)}
                                    className="py-2"
                                >
                                    <div className="flex items-center gap-2 w-full">
                                        <Check
                                            className={`mr-2 h-4 w-4 ${value.includes(pool.id || "") ? "opacity-100" : "opacity-0"
                                                }`}
                                        />
                                        <div className="flex items-center gap-2">
                                            <CoinImage address={pool.collateralToken.collateralToken || ""} />
                                            <CoinSymbol address={pool.collateralToken.collateralToken || ""} />
                                        </div>
                                        <Badge variant="outline">{pool.ltv}% LTV</Badge>
                                    </div>
                                </CommandItem>
                            ))}
                        </ScrollArea>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default MultiSelectPoolsCoin;