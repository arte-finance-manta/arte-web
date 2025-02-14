import { formatAddress } from "@/lib/utils";
import { BadgeCheck, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SkeletonWrapper from "@/components/loader/SkeletonWrapper";
import { PoolSchema } from "@/lib/validation/types";
import { CoinSymbol } from "@/components/coin/CoinSymbol";
import { CoinImageCustom } from "@/components/coin/CoinImageCustom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogSupplyBorrowRepay } from "./DialogSupplyBorrowRepay";
import { NftImage } from "@/components/nft/NftImage";
import { motion } from "framer-motion";
import { calculateReserveSize, calculateAvailableLiquidity, calculateBorrowAPR, calculateLendAPR, calculateUtilizationRate } from "@/lib/helper/helper";
import { useArteNft } from "@/hooks/useArteNft";
import useCurrentAccount from "@/hooks/graphql/useCurrentAccount";

interface Props {
  filteredData?: PoolSchema;
  isLoading: boolean;
}

export default function TopPoolData({
  filteredData,
  isLoading
}: Props) {
  const { nftArteData } = useArteNft();
  const { accountData } = useCurrentAccount();

  const filteredNFTs = nftArteData?.filter((nft) => accountData.positions.some((position) => position.tokenId === nft.tokenId && position.pool.id === filteredData?.id));

  const reserveSize = calculateReserveSize(filteredData?.totalSupplyAssets);
  const availableLiquidity = calculateAvailableLiquidity(
    filteredData?.totalSupplyAssets,
    filteredData?.totalBorrowAssets
  );
  const borrowAPR = calculateBorrowAPR(filteredData?.borrowRate);
  const lendAPR = calculateLendAPR(
    filteredData?.borrowRate,
    filteredData?.totalBorrowAssets,
    filteredData?.totalSupplyAssets
  );
  const utilizationRate = calculateUtilizationRate(
    filteredData?.totalBorrowAssets,
    filteredData?.totalSupplyAssets
  );

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
                      <CoinImageCustom address={filteredData?.collateralToken.collateralToken || ""} className="w-8 h-8" />
                      <CoinSymbol address={filteredData?.collateralToken.collateralToken || ""} className="text-2xl font-bold" />
                    </div>
                  </div>

                  <div className="flex flex-row flex-wrap justify-center md:justify-end gap-2">
                    <Link href={`https://pacific-explorer.sepolia-testnet.manta.network/address/${filteredData?.collateralToken.collateralToken}`} target="_blank" className="cursor-pointer px-1">
                      <Button variant={"outline"} className="cursor-pointer px-3">
                        <Label className="text-[11px] cursor-pointer">{filteredData && formatAddress(filteredData.collateralToken.collateralToken || "", 4)}</Label>
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
                  { label: "Reserve Size", value: `$${reserveSize}` },
                  { label: "Available Liquidity", value: `$${availableLiquidity}` },
                  { label: "Borrow APR", value: `${borrowAPR}%` },
                  { label: "Lend APR", value: `${lendAPR.toFixed(3)}%` },
                  { label: "Utilization Rate", value: `${utilizationRate}%` },
                  { label: "Max LTV", value: `${filteredData?.ltv}%` },
                  { label: "Max LTH", value: `${filteredData?.lth}%` }
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
            <CardContent className="p-5 space-y-5">
              <Label className="text-lg">Your Position</Label>
              <Separator className="w-full" />
              {filteredNFTs.length > 0 ? (
                <ScrollArea>
                  <div className="flex flex-col w-full gap-2 h-auto max-h-48 overflow-auto">
                    {filteredNFTs.map((nft, index) => {
                      const findPosition = accountData.positions.find((position) => position.tokenId === nft.tokenId && position.pool.id === filteredData?.id);

                      return (
                      <DialogSupplyBorrowRepay
                        key={index}
                        filteredData={filteredData}
                        nftData={nft}
                        filteredPosition={findPosition}
                        trigger={
                          <div
                            className="w-full h-auto flex justify-start items-center gap-4 py-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg px-4"
                          >
                            <NftImage path={nft?.contract.openSeaMetadata.imageUrl || ""} />
                            <div className="flex flex-col items-start justify-center gap-1">
                              <Label className="cursor-pointer">{nft.contract.symbol}</Label>
                              <Label className="cursor-pointer text-gray-500 text-xs">Token id: {nft.tokenId}</Label>
                            </div>
                          </div>
                        }
                      />
                    )})}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col w-full gap-2 h-auto max-h-48 overflow-auto">
                  <Label className="text-sm">No position found</Label>
                </div>
              )}
            </CardContent>
          </Card>
        </SkeletonWrapper>
      </div>
    </div>
  );
}