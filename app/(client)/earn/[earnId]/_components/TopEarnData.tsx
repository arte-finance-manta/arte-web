"use client"

import React from "react"
import { formatAddress } from "@/lib/utils";
import { BadgeCheck, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CoinImage } from "@/components/coin/CoinImage";
import { Separator } from "@/components/ui/separator";
import SkeletonWrapper from "@/components/loader/SkeletonWrapper";
import { EarnSchema } from "@/lib/validation/types";
import { motion } from "framer-motion";

interface Props {
  filteredData?: EarnSchema;
  isLoading: boolean;
}

export default function TopEarnData({ filteredData, isLoading }: Props) {
  return (
    <div className="flex flex-col lg:flex-row w-full gap-5">
      <div className="flex flex-col w-full gap-5 lg:w-3/6 flex-1 shrink-0 self-stretch">
        <SkeletonWrapper isLoading={isLoading}>
          <Card className="p-5 w-full">
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row w-full justify-between items-center space-y-4 md:space-y-0">
                <div className="flex flex-col md:flex-row items-center gap-5 space-x-4">
                  <div className="flex flex-col md:flex-row gap-2 items-center">
                    <div className="flex flex-row items-center gap-2">
                      <Label className="text-2xl font-bold">{filteredData && filteredData.name}</Label>
                    </div>
                  </div>

                  <div className="flex flex-row flex-wrap justify-center md:justify-end gap-2">
                    <Link href={`https://pacific-explorer.sepolia-testnet.manta.network/address/${filteredData?.curator}`} target="_blank" className="cursor-pointer px-1">
                      <Button variant={"outline"} className="cursor-pointer px-3">
                        <Label className="text-[11px] cursor-pointer">{filteredData && formatAddress(filteredData && filteredData.curator ? filteredData.curator : "", 4)}</Label>
                        <ExternalLink className="w-2 h-2" />
                      </Button>
                    </Link>
                    <Button variant={"outline"} className="cursor-pointer px-3">
                      <Image src={"https://s2.coinmarketcap.com/static/img/coins/64x64/13631.png"} alt="Base Network" width={24} height={24} className="rounded-full" />
                      <Label className="text-[11px] cursor-pointer">Manta Sepolia</Label>
                    </Button>
                    <Button variant={"outline"} className="cursor-pointer px-3">
                      <BadgeCheck className="w-3 h-3 text-green-500" />
                      <Label className="text-[11px] cursor-pointer">Governance Forum</Label>
                      <ExternalLink className="w-2 h-2" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {[
                  {
                    label: "Lend Asset", value: (
                      <div className="flex flex-row gap-2 items-center justify-center">
                        <CoinImage symbol={"MANTA"} />
                        <Label className="text-lg font-medium">{"MANTA"}</Label>
                      </div>
                    )
                  },
                  { label: "TVL", value: `0` },
                  { label: "APY", value: `0` },
                  { label: "Utilization Rate", value: `0` },
                ].map((metric, index) => (
                  <motion.div
                    whileHover={{
                      scale: 1.03
                    }}
                    transition={{
                      duration: 0.6,
                      type: "spring",
                      stiffness: 300
                    }}
                    key={index}
                    className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-center hover:shadow-sm"
                  >
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">{metric.label}</div>
                    <div className="text-lg font-bold text-neutral-800 dark:text-neutral-200">{metric.value}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </SkeletonWrapper>
      </div>
      <div className="w-full lg:w-[480px] self-stretch">
        <SkeletonWrapper isLoading={isLoading}>
          <Card className="w-full h-full">
            <CardContent className="p-5 flex flex-col gap-5">
              <Label className="text-lg">Your Deposit</Label>
              <Separator className="w-full" />
              <div className="flex flex-row justify-between">
                <Label>Deposit :</Label>
                <Label>soon</Label>
              </div>
            </CardContent>
          </Card>
        </SkeletonWrapper>
      </div>
    </div>
  )
}
