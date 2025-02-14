"use client"

import InterestRateChart from "@/components/chart/InterestRateChart";
import SkeletonWrapper from "@/components/loader/SkeletonWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import React from "react"
import TablePool from "./TablePool";
import TopEarnData from "./TopEarnData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import useEarn from "@/hooks/graphql/useEarn";

export default function EarnIdPage({ earnId }: { earnId: string }) {
    const { earnData, earnLoading: isLoading } = useEarn();

    const filteredData = earnData?.find((item) => item.id === earnId);

    return (
        <div className="flex flex-col gap-5 w-full">
            <TopEarnData filteredData={filteredData} isLoading={isLoading} />
            <div className="flex flex-col-reverse lg:flex-row w-full gap-5">
                <div className="flex flex-col w-full lg:w-3/6 gap-5 flex-1 shrink-0 self-stretch">
                    <SkeletonWrapper isLoading={isLoading}>
                        <Card className="w-full">
                            <CardContent className="p-5 space-y-5">
                                <Label>Performance</Label>
                                <Separator className="w-full" />
                                <div className="relative">
                                    <InterestRateChart />
                                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex justify-center items-center">
                                        <Label className="text-lg bg-primary text-background px-5 py-3 rounded-full font-bold">Coming Soon</Label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </SkeletonWrapper>
                    <SkeletonWrapper isLoading={isLoading}>
                        <Card className="w-full">
                            <CardContent className="p-5 space-y-5 max-w-full">
                                <Label>Whitelisted Pools</Label>
                                <Separator className="w-full" />
                                <TablePool />
                            </CardContent>
                        </Card>
                    </SkeletonWrapper>
                </div>
                <div className="w-full lg:w-[480px] self-stretch">
                    <SkeletonWrapper isLoading={isLoading}>
                        <Card className="w-full">
                            <CardContent className="p-5 space-y-5">
                                <Tabs defaultValue="deposit" className="w-full">
                                    <TabsList className="w-full">
                                        <TabsTrigger value="deposit" className="w-full">Deposit</TabsTrigger>
                                        <TabsTrigger value="withdraw" className="w-full">Withdraw</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="deposit">
                                        <Deposit filteredData={filteredData} />
                                    </TabsContent>
                                    <TabsContent value="withdraw">
                                        <Withdraw filteredData={filteredData} />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </SkeletonWrapper>
                </div>
            </div>
        </div>
    )
}