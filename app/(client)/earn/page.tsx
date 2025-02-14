import React, { Suspense } from "react"
import TableEarn from "./_components/TableEarn"
import { Label } from "@/components/ui/label"
import Loading from "@/components/loader/Loading"
export default function page() {
    return (
        <Suspense fallback={<Loading />}>
            <div className="w-full flex-1 px-5 sm:px-10 lg:px-20">
                <div className="w-full h-full flex gap-5 xl:max-w-screen-xl lg:max-w-screen-lg mx-auto justify-center">
                    <div className="flex flex-col container gap-5">
                        <div className="flex flex-col gap-1 max-w-lg">
                            <Label className="text-2xl">Arte Earn</Label>
                            <Label className="text-md text-gray-400">Earn yield by depositing your assets with a curator. The curator will manage them to achieve the highest possible returns across a variety of risk levels.</Label>
                        </div>
                        <TableEarn />
                    </div>
                </div>
            </div>
        </Suspense>
    )
}
