"use client"

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAllAuction } from "@/actions/get-all-auction";
import { NFTCardSkeleton } from "./NFTCardSkeleton";
import { AuctionSidebar } from "./AuctionSidebar";
import { NFTCard } from "./NFTCard";

export const COLLECTIONS = ["All Collections", "IP1", "IP2", "IP3"];
export const SORT_OPTIONS = [
    { label: "Potential Profit (Highest)", value: "profit_desc" },
    { label: "Potential Profit (Lowest)", value: "profit_asc" },
    { label: "Floor Price (Highest)", value: "floor_desc" },
    { label: "Floor Price (Lowest)", value: "floor_asc" },
];

const AuctionsComponent: React.FC = () => {
    const [searchText, setSearchText] = useState("");
    const [collection, setCollection] = useState("All Collections");
    const [sortBy, setSortBy] = useState("profit_desc");

    const { auctionData, auctionLoading } = getAllAuction();

    const filteredAndSortedAuctions = useMemo(() => {
        const currentDate = new Date();

        const dataToFilter = auctionData || [];

        return dataToFilter
            .filter(nft => {
                if (!nft) return false;

                const createdAtDate = nft.createdAt ? new Date(nft.createdAt) : new Date();
                const hoursDifference = (currentDate.getTime() - createdAtDate.getTime()) / (1000 * 3600);

                return hoursDifference <= 25 &&
                    nft.tokenId && nft.tokenId.toString().includes(searchText) &&
                    (collection === "All Collections" || nft.nftSymbol === collection);
            })
            .sort((a, b) => {
                const parseOrZero = (value: string | number | undefined) =>
                    value ? parseInt(String(value)) : 0;

                switch (sortBy) {
                    case "profit_desc":
                        return (parseOrZero(b.debt) - parseOrZero(b.floorPrice)) -
                            (parseOrZero(a.debt) - parseOrZero(a.floorPrice));
                    case "profit_asc":
                        return (parseOrZero(a.debt) - parseOrZero(a.floorPrice)) -
                            (parseOrZero(b.debt) - parseOrZero(b.floorPrice));
                    case "floor_desc":
                        return parseOrZero(b.floorPrice) - parseOrZero(a.floorPrice);
                    case "floor_asc":
                        return parseOrZero(a.floorPrice) - parseOrZero(b.floorPrice);
                    default:
                        return 0;
                }
            });
    }, [auctionData, searchText, collection, sortBy]);

    const handleClearFilters = () => {
        setSearchText("");
        setCollection("All Collections");
        setSortBy("profit_desc");
    };

    return (
        <div className="flex flex-col lg:flex-row w-full container">
            <AuctionSidebar
                searchText={searchText}
                setSearchText={setSearchText}
                collection={collection}
                setCollection={setCollection}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onClearFilters={handleClearFilters}
            />

            <div className="flex-1 px-6 py-4">
                <div className="mb-6">
                    <Alert variant="default">
                        <AlertDescription className="text-sm">
                            💡 Tip: The first bidder will receive a bonus if the borrower redeems their debt before the auction ends.
                        </AlertDescription>
                    </Alert>
                </div>

                <AnimatePresence>
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                        {auctionLoading
                            ? Array(4).fill(0).map((_, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <NFTCardSkeleton />
                                </motion.div>
                            ))
                            : filteredAndSortedAuctions.map((nft) => (
                                <motion.div
                                    key={nft.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <NFTCard
                                        nft={nft}
                                        isLoading={false}
                                    />
                                </motion.div>
                            ))
                        }
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AuctionsComponent;