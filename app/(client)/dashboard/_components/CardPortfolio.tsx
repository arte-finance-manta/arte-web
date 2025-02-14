import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import React from "react"

export default function CardPortfolio() {
    return (
        <Card className="w-full">
            <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex flex-row justify-between">
                    <Label className="text-md">Portfolio</Label>
                    <div className="flex flex-row bg-textSecondary/20 rounded-full px-3 py-1">
                        <Label className="text-textSecondary font-normal">Available to Borrow:</Label>
                        <Label>&nbsp;$0.00</Label>
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col gap-2">
                        <Label className="text-md font-normal">Total Deposited</Label>
                        <Label className="text-xl">$0.00</Label>
                    </div>
                    <div className="flex flex-row space-x-7 items-center justify-center">
                        <Separator orientation="vertical" className="h-[60px]" />
                        <div className="flex flex-col gap-2">
                            <Label className="text-md font-normal">Total Borrowed</Label>
                            <Label className="text-xl">$0.00</Label>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
