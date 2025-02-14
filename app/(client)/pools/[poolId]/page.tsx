import React, { Suspense, use } from "react";
import PoolIdPage from "./_components/PoolIdPage";
import Loading from "@/components/loader/Loading";

type Params = Promise<{ poolId: string }>

const Page = (props: { params: Params }) => {
    const params = use(props.params);
    const poolId = params.poolId;

    return (
        <Suspense fallback={<Loading />}>
            <div className="w-full flex-1 px-5 sm:px-10 lg:px-20 items-start justify-center flex">
                <div className="w-full h-full flex xl:max-w-screen-xl lg:max-w-screen-lg mx-auto justify-center">
                    <PoolIdPage PoolId={poolId} />
                </div>
            </div>
        </Suspense>
    );
};

export default Page;