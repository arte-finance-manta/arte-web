import Loading from "@/components/loader/Loading";
import { Suspense } from "react";
import OverviewPage from "./_components/OverviewPage";

export default function page() {
    return (
        <Suspense fallback={<Loading />}>
            <div className="w-full flex-1 px-5 sm:px-10 lg:px-20 items-start justify-center flex">
                <div className="w-full h-full flex xl:max-w-screen-xl lg:max-w-screen-lg mx-auto">
                    <OverviewPage />
                </div>
            </div>
        </Suspense>
    )
}