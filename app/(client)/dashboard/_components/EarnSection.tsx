import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronUp, UserRound } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import TableEarn from "./TableEarn"
import { EarnSchema } from "@/lib/validation/types"

type Props = {
    earnData: EarnSchema[];
    earnLoading: boolean;
    earnRefetching: boolean;
}

export const EarnSection = ({
    earnData,
    earnLoading,
    earnRefetching,
}: Props) => {
    return (
        <Card className="w-full">
            <CardContent className="p-5 space-y-5">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-2 items-center">
                        <UserRound className="w-8 h-8" />
                        <div className="flex flex-col gap-1 justify-center">
                            <Label className="text-lg">Earn</Label>
                            <Label>{earnData.length} Positions</Label>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <Label className="text-lg">0</Label>
                        <ChevronUp className="w-5 h-5 cursor-pointer" />
                    </div>
                </div>
                <Separator />
                {earnData.length > 0 ?
                    <TableEarn
                        // accountCuratorData={accountCuratorData}
                        // accountCuratorLoading={accountCuratorLoading}
                        // accountCuratorRefetching={accountCuratorRefetching}
                        earnData={earnData}
                        earnLoading={earnLoading}
                        earnRefetching={earnRefetching}
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