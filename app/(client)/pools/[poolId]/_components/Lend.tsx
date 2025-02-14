"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import Withdraw from "./Withdraw";
import { PoolSchema } from "@/lib/validation/types";
import Supply from "./Supply";
import { Card, CardContent } from "@/components/ui/card";

interface LendProps {
    filteredData?: PoolSchema;
}

export default function Lend({
    filteredData,
}: LendProps) {
    const [activeTab, setActiveTab] = useState("supply");

    return (
        <Card className="w-full">
            <CardContent className="p-5 space-y-5">
                <Tabs defaultValue="supply" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-fit bg-transparent">
                        <TabsTrigger
                            value="supply"
                            className={`w-full border-b rounded-none ${activeTab === "supply" ? "border-b-primary" : "border-transparent"}`}
                        >
                            Supply
                        </TabsTrigger>
                        <TabsTrigger
                            value="withdraw"
                            className={`w-full border-b rounded-none ${activeTab === "withdraw" ? "border-b-primary" : "border-transparent"}`}
                        >
                            Withdraw
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="supply">
                        <Supply
                            filteredData={filteredData!}
                        />
                    </TabsContent>
                    <TabsContent value="withdraw">
                        <Withdraw
                            filteredData={filteredData!}
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}