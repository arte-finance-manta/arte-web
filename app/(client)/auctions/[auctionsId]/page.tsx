import React, { Suspense, use } from "react"
import AuctionsIdComponent from "./_components/AuctionsIdComponent"
import Loading from "@/components/loader/Loading";

type Params = Promise<{ auctionsId: string }>

const Page = (props: { params: Params }) => {
    const params = use(props.params);
    const auctionsId = params.auctionsId;

    return (
        <Suspense fallback={<Loading />}>
            <div className="w-full flex-1 px-5 sm:px-10 lg:px-20 items-start justify-center flex">
                <div className="w-full h-full flex xl:max-w-screen-xl lg:max-w-screen-lg mx-auto justify-center">
                    <AuctionsIdComponent auctionsId={auctionsId} />
                </div>
            </div>
        </Suspense>
    )
}

export default Page