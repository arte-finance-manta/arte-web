import { CoinImageCustom } from "@/components/coin/CoinImageCustom";
import { motion } from "framer-motion";
import { CheckCircle, Plus } from "lucide-react";
import { FormControl } from "@/components/ui/form";
import { CoinMarketCapSchema } from "@/lib/validation/types";
import SkeletonWrapper from "../loader/SkeletonWrapper";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { ScrollArea } from "../ui/scroll-area";
import { useState } from "react";
import { Button } from "../ui/button";

interface SelectCoinImageProps {
    data?: CoinMarketCapSchema[];
    value?: string;
    onChange?: (value: string) => void;
    isLoading: boolean;
}

const SelectCoinImage: React.FC<SelectCoinImageProps> = ({
    data,
    value = "",
    onChange,
    isLoading
}) => {
    const loadingPlaceholders = Array(3).fill(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const excludedSymbols = ["USDC", "BAYC", "AZUKI", "USDT"];

    const mainDisplayCoins = data?.filter(coin =>
        excludedSymbols.includes(coin.symbol.toUpperCase())
    );

    const dialogCoins = data?.filter(coin =>
        !excludedSymbols.includes(coin.symbol.toUpperCase())
    );

    const selectedDialogCoin = data?.find(coin =>
        coin.platform?.token_address === value &&
        !excludedSymbols.includes(coin.symbol.toUpperCase())
    );

    return (
        <FormControl>
            <div className="flex flex-wrap gap-4 p-4">
                {isLoading ? (
                    loadingPlaceholders.map((_, index) => (
                        <div key={index} className="relative">
                            <div className="relative rounded-full overflow-hidden">
                                <div className="w-20 h-20">
                                    <SkeletonWrapper isLoading={true}>
                                        <div className="w-20 h-20" />
                                    </SkeletonWrapper>
                                </div>
                            </div>
                            <div className="mt-2 h-4 w-16 mx-auto">
                                <SkeletonWrapper isLoading={true}>
                                    <div className="w-full h-full" />
                                </SkeletonWrapper>
                                <SkeletonWrapper isLoading={true}>
                                    <div className="mt-2 text-center text-sm font-medium">
                                        Symbol
                                    </div>
                                </SkeletonWrapper>
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        {mainDisplayCoins?.map((coin: CoinMarketCapSchema) => {
                            const tokenAddress = coin.contract_address[0]?.contract_address || "";

                            return (
                                <motion.div
                                    key={coin.id}
                                    className="relative cursor-pointer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onChange?.(tokenAddress)}
                                >
                                    <div className={`relative rounded-full overflow-hidden transition-all duration-200
                                        ${value === tokenAddress ? "ring-4 ring-gray-400 dark:ring-white" : "ring-1 ring-gray-200 hover:ring-primary/50"}
                                    `}>
                                        <CoinImageCustom
                                            symbol={coin.symbol}
                                            className="w-20 h-20 object-cover brightness-90"
                                        />
                                        {value === tokenAddress && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <CheckCircle className="w-8 h-8 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className={`mt-2 text-center text-sm font-medium
                                        ${value === tokenAddress ? "text-primary" : "text-gray-600"}
                                    `}>
                                        {coin.symbol}
                                    </div>
                                </motion.div>
                            );
                        })}
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex flex-col gap-3 items-center justify-center cursor-pointer"
                                >
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center outline outline-2 outline-gray-400 transition-all duration-200">
                                        {selectedDialogCoin ? (
                                            <div className="relative rounded-full overflow-hidden transition-all duration-200 ring-4 ring-gray-400 dark:ring-white">
                                                <CoinImageCustom
                                                    symbol={selectedDialogCoin.symbol}
                                                    className="w-20 h-20 object-cover brightness-90"
                                                />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <CheckCircle className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        ) : (
                                            <Plus className="w-7 h-7" />
                                        )}
                                    </div>
                                    <Label>{selectedDialogCoin ? selectedDialogCoin.symbol : "More"}</Label>
                                </motion.div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <div className="flex items-center gap-2 pl-5">
                                        <DialogTitle className="text-xl font-semibold">Select a currency</DialogTitle>
                                    </div>
                                </DialogHeader>
                                <ScrollArea className="max-h-80 overflow-auto">
                                    {dialogCoins?.map((token: CoinMarketCapSchema) => {
                                        const tokenAddress = token.contract_address[0]?.contract_address || "";
                                        return (
                                            <Button
                                                key={token.id}
                                                onClick={() => {
                                                    onChange?.(tokenAddress);
                                                    setIsDialogOpen(false);
                                                }}
                                                variant={"ghost"}
                                                className="w-full h-auto flex justify-between items-center"
                                            >
                                                <div className="flex flex-row items-center cursor-pointer justify-start gap-3">
                                                    <CoinImageCustom symbol={token?.symbol || ""} className="w-9 h-9"/>
                                                    <div className="flex flex-col items-start justify-center gap-3">
                                                        <Label className="cursor-pointer">{token?.symbol}</Label>
                                                        <Label className="cursor-pointer text-gray-500">{token?.name} ({token?.contract_address[0].platform.name})</Label>
                                                    </div>
                                                </div>
                                            </Button>
                                        );
                                    })}
                                    {dialogCoins?.length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-full py-8">
                                            <span className="text-gray-500">No data found</span>
                                        </div>
                                    )}
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                    </>
                )}
            </div>
        </FormControl>
    );
};

export default SelectCoinImage;