import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ColumnHeader";
import { AuctionApiSchema, BidsSchema } from "@/lib/validation/types";
import { CoinImage } from "@/components/coin/CoinImage";
import { CoinSymbol } from "@/components/coin/CoinSymbol";
import { formatAddress } from "@/lib/utils";

export function columns(auctionDetails: AuctionApiSchema): ColumnDef<BidsSchema>[] {
  return [
    {
      accessorKey: "event",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Event"
        />
      ),
      cell: () => (
        <div className="flex items-center gap-2">
          <span className="capitalize">Bid</span>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Amount"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.original.amount ? row.original.amount.toLocaleString() : "0"}</span>
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Address"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
            <span className="font-medium whitespace-nowrap">{row.original.bidder ? formatAddress(row.original.bidder, 6) : "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "loanId",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Loan ID"
        />
      ),
      cell: ({ row }) => {
        const findAuctionDetails = auctionDetails?.tokenId === row.original.tokenId && auctionDetails?.poolId === row.original.poolId;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{findAuctionDetails ? (
              <div className="flex flex-row gap-2 items-center">
                <CoinImage address={auctionDetails.loanAddress} />
                <CoinSymbol address={auctionDetails.loanAddress} />
              </div>
            ) : ""}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Date"
          className="justify-end"
        />
      ),
      cell: ({ row }) =>
      (
        <div className="text-right">
          <span className="whitespace-nowrap">{row.original.blockTimestamp ? new Date(Number(row.original.blockTimestamp) * 1000).toLocaleString() : "N/A"}</span>
        </div>
      ),
    }
  ];
}