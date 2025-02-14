import SkeletonWrapper from "@/components/loader/SkeletonWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuctionApiSchema } from "@/lib/validation/types";
import { useMemo } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { normalize } from "@/lib/helper/bignumber";

interface NFTCardProps {
    nft: AuctionApiSchema;
    isLoading: boolean;
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft, isLoading }) => {
    const potentialProfit = useMemo(() => {
        const debt = parseFloat(normalize(nft.debt, 6));
        const floorPrice = parseFloat(normalize(nft.floorPrice, 6));
        return (floorPrice - debt).toFixed(2);
    }, [nft.debt, nft.floorPrice]);

    return (
        <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4">
                <div className="relative mb-4">
                    <SkeletonWrapper isLoading={isLoading}>
                        <Image
                            src={nft.nftImageUrl || "/img/placeholder-nft.jpg"}
                            alt={`NFT ${nft.nftSymbol} #${nft.tokenId}`}
                            width={300}
                            height={300}
                            className="rounded-lg w-full aspect-square object-cover"
                            priority
                        />
                        <div className="absolute top-2 right-2 bg-background/80 px-2 py-1 rounded-full text-xs font-medium">
                            #{nft.tokenId}
                        </div>
                    </SkeletonWrapper>
                </div>

                <div className="space-y-2">
                    <SkeletonWrapper isLoading={isLoading}>
                        <div className="flex flex-row gap-2 text-sm font-semibold truncate">
                            <Label>{nft.nftSymbol}</Label>
                            <Label>#{nft.tokenId}</Label>
                        </div>
                    </SkeletonWrapper>

                    <div className="grid grid-cols-2 gap-2">
                        <SkeletonWrapper isLoading={isLoading}>
                            <div className="text-xs text-textGraycustom">Floor Price</div>
                            <div className="text-xs font-medium text-right">{parseInt(normalize(nft.floorPrice, 6))}</div>
                        </SkeletonWrapper>
                        <SkeletonWrapper isLoading={isLoading}>
                            <div className="text-xs text-textGraycustom">Debt</div>
                            <div className="text-xs font-medium text-right">{nft.debt && (parseInt(normalize(nft.debt, 6))).toFixed(2)}</div>
                        </SkeletonWrapper>
                        <SkeletonWrapper isLoading={isLoading}>
                            <div className="text-xs text-textGraycustom">Potential Profit</div>
                            <div className={`text-xs font-medium text-right ${parseFloat(potentialProfit) > 0 ? "text-green-500" : "text-red-500"
                                }`}>
                                {potentialProfit}
                            </div>
                        </SkeletonWrapper>
                    </div>
                </div>

                <SkeletonWrapper isLoading={isLoading}>
                    <Link href={`/auctions/${nft.poolId}-${nft.tokenId}`} className="block mt-4">
                        <Button className="w-full" variant="default">
                            Place a Bid
                        </Button>
                    </Link>
                </SkeletonWrapper>
            </CardContent>
        </Card>
    );
};