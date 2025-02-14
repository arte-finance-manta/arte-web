import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { CoinImage } from "../coin/CoinImage"
import { ScrollArea } from "../ui/scroll-area"
import { CoinMarketCapSchema } from "@/lib/validation/types"

interface DialogSelectTokenProps {
    tokenUsed: CoinMarketCapSchema[]
    isDialogOpen: boolean
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    handleSelect: (token: CoinMarketCapSchema) => void
    trigger: React.ReactNode
}

export const DialogSelectToken = ({
    tokenUsed,
    isDialogOpen,
    setDialogOpen,
    handleSelect,
    trigger
}: DialogSelectTokenProps) => {
    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pl-5 text-xl font-semibold">Select a currency</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-80 overflow-auto flex flex-col w-full h-auto gap-2">
                    {tokenUsed.map((token: CoinMarketCapSchema) => (
                        <Button key={token.id} value={token.id} variant={"ghost"} className="w-full h-auto flex justify-between items-center" onClick={() => handleSelect(token)}>
                            <div className="flex flex-row items-center cursor-pointer justify-start gap-3">
                                <CoinImage address={token.contract_address[0].contract_address} />
                                <div className="flex flex-col items-start justify-center gap-3">
                                    <Label className="cursor-pointer">{token.symbol}</Label>
                                    <Label className="cursor-pointer text-gray-500">{token.name} ({token.contract_address[0].platform.coin.name})</Label>
                                </div>
                            </div>
                        </Button>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
