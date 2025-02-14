import React, { Suspense } from "react"
import BorrowComponent from "./_components/BorrowComponent"
import Loading from "@/components/loader/Loading"

export default function page() {
    return (
        <Suspense fallback={<Loading />}>
            <div className="w-full flex-1 px-5 sm:px-10 lg:px-20 items-start justify-center flex">
                <div className="w-full h-full flex xl:max-w-screen-xl lg:max-w-screen-lg mx-auto justify-center">
                    <BorrowComponent />
                </div>
            </div>
        </Suspense>
    )
}