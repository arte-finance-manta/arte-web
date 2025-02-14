import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import React from "react"

export default function CardRewards() {
    return (
        <Card className="w-full border-blue-500 border-2">
            <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex flex-row justify-between">
                    <Label className="text-md">Rewards</Label>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm text-textSecondary font-normal">Estimated Rewards</Label>
                        <Label className="text-xl">$0.00</Label>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
