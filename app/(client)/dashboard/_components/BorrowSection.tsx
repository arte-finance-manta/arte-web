import TableBorrow from "./TableBorrow"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ChevronUp } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { formatNumberWithDots } from "@/lib/utils"
import { AlchemyNftSchema, BorrowSchema, PoolSchema } from "@/lib/validation/types"
import { normalize } from "@/lib/helper/bignumber"

type Props = {
    borrowData: BorrowSchema[];
    borrowLoading: boolean;
    borrowRefetching: boolean;
    poolData: PoolSchema[];
    poolLoading: boolean;
    nftData: AlchemyNftSchema[]
    nftLoading: boolean;
    address: HexAddress;
}

export const BorrowSection = ({
    borrowData,
    borrowLoading,
    borrowRefetching,
    poolData,
    poolLoading,
    nftData,
    nftLoading,
    address
}: Props) => {
    const findCurrentBorrow = borrowData?.filter((data) => data.receiver?.toLowerCase() === address?.toLowerCase())

    const totalBorrowAmount = findCurrentBorrow.reduce((sum, borrow) => {
        return sum + (parseFloat(borrow.amount) || 0);
    }, 0);

    return (
        <Card className="w-full">
            <CardContent className="p-5 space-y-5">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-2 items-center">
                        <ArrowUp className="w-8 h-8" />
                        <div className="flex flex-col gap-1 justify-center">
                            <Label className="text-lg">Borrow</Label>
                            <Label>{findCurrentBorrow.length} Positions</Label>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <Label className="text-lg">{formatNumberWithDots(Number(normalize(totalBorrowAmount.toString(), 6)))}</Label>
                        <ChevronUp className="w-5 h-5 cursor-pointer" />
                    </div>
                </div>
                <Separator />
                {findCurrentBorrow.length > 0 ?
                    <TableBorrow
                        borrowData={findCurrentBorrow}
                        borrowLoading={borrowLoading}
                        borrowRefetching={borrowRefetching}
                        poolData={poolData}
                        poolLoading={poolLoading}
                        nftData={nftData}
                        nftLoading={nftLoading}
                    />
                    :
                    <div className="flex flex-col gap-5 items-center justify-center py-10">
                        <Label className="text-lg">No Position Yet</Label>
                        <Link href={`/pools`}><Button className="w-fit">View Pools</Button></Link>
                    </div>
                }
            </CardContent>
        </Card>
    )
}