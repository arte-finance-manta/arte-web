import React, { Suspense } from "react";
import EarnIdPage from "./_components/EarnIdPage";
import { use } from "react";
import Loading from "@/components/loader/Loading";

type Params = Promise<{ earnId: string }>

const Page = (props: { params: Params }) => {
    const params = use(props.params);
    const earnId = params.earnId;

    return (
        <Suspense fallback={<Loading />}>
            <div className="w-full flex-1 px-5 sm:px-10 lg:px-20 items-start justify-center flex">
                <div className="w-full h-full flex xl:max-w-screen-xl lg:max-w-screen-lg mx-auto">
                    <EarnIdPage earnId={earnId} />
                </div>
            </div>
        </Suspense>
    );
};

export default Page;