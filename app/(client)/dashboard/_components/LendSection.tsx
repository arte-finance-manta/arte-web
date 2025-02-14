import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ChevronUp } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { AccountLendSchema, PoolSchema } from "@/lib/validation/types"
import TableLend from "./TableLend"

type Props = {
    poolData: PoolSchema[];
    poolLoading: boolean;
    accountLendData?: AccountLendSchema[];
    accountLendLoading: boolean;
    accountLendRefetching: boolean;
}

export const LendSection = ({ poolData, poolLoading, accountLendData, accountLendLoading, accountLendRefetching }: Props) => {
    return (
        <Card className="w-full">
            <CardContent className="p-5 space-y-5">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-2 items-center">
                        <ArrowDown className="w-8 h-8" />
                        <div className="flex flex-col gap-1 justify-center">
                            <Label className="text-lg">Lend</Label>
                            <Label>{accountLendData?.length} Positions</Label>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <Label className="text-lg">0</Label>
                        <ChevronUp className="w-5 h-5 cursor-pointer" />
                    </div>
                </div>
                <Separator />
                {accountLendData?.length && accountLendData?.length > 0 ?
                    <TableLend
                        poolData={poolData}
                        poolLoading={poolLoading}
                        accountLendData={accountLendData || []}
                        accountLendLoading={accountLendLoading}
                        accountLendRefetching={accountLendRefetching}
                    />
                    :
                    <div className="flex flex-col gap-5 items-center justify-center py-10">
                        <Label className="text-lg">No Position Yet</Label>
                        <Link href={`/pools`}><Button className="w-fit">View Earn</Button></Link>
                    </div>
                }
            </CardContent>
        </Card>
    )
}