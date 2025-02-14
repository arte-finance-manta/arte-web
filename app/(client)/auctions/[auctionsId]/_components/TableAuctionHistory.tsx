import { columns } from "@/components/tables/auctions/history/columns";
import { DataTable } from "@/components/tables/auctions/history/DataTable";
import { AuctionApiSchema, BidsSchema } from "@/lib/validation/types";

type Props = {
    bids: BidsSchema[];
    auctionDetails: AuctionApiSchema;
    bidsLoading: boolean;
    auctionLoading: boolean;
}

export const TableAuctionHistory = ({ bids, auctionDetails, bidsLoading, auctionLoading }: Props) => {
    return (
        <div className="w-full space-y-4 h-auto z-10">
            <DataTable
                data={bids || []}
                columns={columns(auctionDetails)}
                isLoading={bidsLoading || auctionLoading}
            />
        </div>
    )
}