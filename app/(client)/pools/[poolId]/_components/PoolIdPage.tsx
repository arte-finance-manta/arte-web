"use client";

import InterestRateChart from "@/components/chart/InterestRateChart";
import SkeletonWrapper from "@/components/loader/SkeletonWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import React from "react";
import Lend from "./Lend";
import { PoolSchema } from "@/lib/validation/types";
import SupplyCollateral from "./SupplyCollateral";
import { useOwnerNft } from "@/hooks/useOwnerNft";
import usePools from "@/hooks/graphql/usePools";
import { useAccount } from "wagmi";
import { WarningConnectWallet } from "@/components/web3/warning-connect-wallet";
import { listIP } from "@/constants/config";
import TopPoolData from "./TopPoolData";

export default function PoolIdPage({ PoolId }: { PoolId: string }) {
  const { poolData, poolLoading: isLoading } = usePools();
  const { nftData, nftLoading } = useOwnerNft({ contractAdresses: listIP });

  const filteredData: PoolSchema | undefined = poolData?.find(
    (item: PoolSchema) => item.id === PoolId
  );

  const { address } = useAccount();

  return (
    <>
      <div className="container flex flex-col gap-5">
        <TopPoolData filteredData={filteredData} isLoading={isLoading} />
        <div className="flex flex-col-reverse lg:flex-row w-full gap-5">
          <div className="flex flex-col w-full gap-5 lg:w-3/6 flex-1 shrink-0 self-stretch">
            <SkeletonWrapper isLoading={isLoading}>
              <Card className="w-full">
                <CardContent className="p-5 space-y-5">
                  <Label>Performance</Label>
                  <Separator className="w-full" />
                  <InterestRateChart />
                </CardContent>
              </Card>
            </SkeletonWrapper>
          </div>
          <div className="w-full lg:w-[480px] self-stretch">
            <div className="flex flex-col gap-5 w-full">
              <SkeletonWrapper isLoading={isLoading}>
                <SupplyCollateral
                  nftData={nftData || []}
                  filteredData={filteredData}
                  nftLoading={nftLoading}
                />
              </SkeletonWrapper>
              <SkeletonWrapper isLoading={isLoading}>
                <Lend filteredData={filteredData} />
              </SkeletonWrapper>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
