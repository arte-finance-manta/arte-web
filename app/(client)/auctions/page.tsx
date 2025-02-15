"use client"

import React, { Suspense, useEffect } from "react"
import AuctionsComponent from "./_components/AuctionsComponent"
import Loading from "@/components/loader/Loading"

export default function Page() {
    useEffect(() => {
        setTimeout(async() => {
            await fetch(
                `/api/auction-check`
            )
        }, 10000)
    }, [])

    return (
        <Suspense fallback={<Loading />}>
            <div className="w-full flex-1 px-5 sm:px-10 lg:px-20 items-start justify-center flex">
                <div className="w-full h-full flex xl:max-w-screen-xl lg:max-w-screen-lg mx-auto justify-center">
                    <AuctionsComponent />
                </div>
            </div>
        </Suspense>
    )
}
