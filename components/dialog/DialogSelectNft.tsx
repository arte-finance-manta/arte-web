import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { ScrollArea } from "../ui/scroll-area"
import { AlchemyNftSchema } from "@/lib/validation/types"
import SkeletonWrapper from "../loader/SkeletonWrapper"
import { NftImage } from "../nft/NftImage"

interface DialogSelectNftProps {
    nftData: AlchemyNftSchema[]
    isDialogOpen: boolean
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    handleSelect: (nft: AlchemyNftSchema) => void
    nftLoading: boolean
    trigger: React.ReactNode
}

export const DialogSelectNft = ({
    nftData,
    isDialogOpen,
    setDialogOpen,
    handleSelect,
    nftLoading,
    trigger
}: DialogSelectNftProps) => {
    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pl-5 text-xl font-semibold">Select an NFT</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-80 overflow-auto flex flex-col w-full h-auto gap-2">
                    <SkeletonWrapper isLoading={nftLoading}>
                        {nftData.map((nft: AlchemyNftSchema, index: number) => (
                            <Button key={index} value={nft.tokenId} variant={"ghost"} className="w-full h-auto flex justify-between items-center" onClick={() => handleSelect(nft)}>
                                <div className="flex flex-row items-center cursor-pointer justify-start gap-3">
                                    <NftImage path={nft?.contract.openSeaMetadata.imageUrl || ""} />
                                    <div className="flex flex-col items-start justify-center gap-3">
                                        <Label className="cursor-pointer">{nft.contract.symbol}</Label>
                                        <Label className="cursor-pointer text-gray-500">token id: {nft.tokenId}</Label>
                                    </div>
                                </div>
                            </Button>
                        ))}
                    </SkeletonWrapper>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
