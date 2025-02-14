import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ColumnHeader";
import { CoinImage } from "@/components/coin/CoinImage";
import { AccountLendSchema, PoolSchema } from "@/lib/validation/types";
import { CoinSymbol } from "@/components/coin/CoinSymbol";
import { formatAddress, formatNumberWithDots } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import SkeletonWrapper from "@/components/loader/SkeletonWrapper";
import { normalize } from "@/lib/helper/bignumber";

type Props = {
  poolData: PoolSchema[];
  poolLoading: boolean;
};

export function columns({ poolData, poolLoading }: Props): ColumnDef<AccountLendSchema>[] {
  return [
    {
      accessorKey: "pool",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pool" />
      ),
      cell: ({ row }) => {
        const findPoolByAccount = poolData.find(pool => pool.id === row.original.poolId)

        return (
          <SkeletonWrapper isLoading={poolLoading}>
            <Link href={`/pools/${row.original.id}`}>
              <Button variant={"ghost"} className="p-1 px-2 py-2">
                <div className="flex items-center gap-1">
                  <span>{formatAddress(findPoolByAccount?.id as string, 6) || ""}</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </Button>
            </Link >
          </SkeletonWrapper>
        )
      },
    },
    {
      accessorKey: "collateral",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Collateral" />
      ),
      cell: ({ row }) => {
        const findPoolByAccount = poolData.find(pool => pool.id === row.original.poolId)

        return (
          <div className="flex items-center gap-2">
            <CoinImage address={findPoolByAccount?.collateralToken.collateralToken || ""} />
            <CoinSymbol address={findPoolByAccount?.collateralToken.collateralToken || ""} />
          </div>
        )
      },
    },
    {
      accessorKey: "lendAPR",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Lend APR"
        />
      ),
      cell: ({ row }) => {
        const findPoolByAccount = poolData.find(pool => pool.id === row.original.poolId)
        const lendAPR = (findPoolByAccount?.borrowRate ?? 0) * (findPoolByAccount?.totalBorrowAssets ?? 0) / (findPoolByAccount?.totalSupplyAssets ?? 0)

        return (
          <div className="flex items-center gap-2">
            <span>{Number(normalize(lendAPR, 16))?.toFixed(2) || 0}%</span>
          </div>
        )
      }
    },
    {
      accessorKey: "asset",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Asset" />
      ),
      cell: ({ row }) => {
        const findPoolByAccount = poolData.find(pool => pool.id === row.original.poolId)

        return (
          <div className="flex items-center gap-2">
            <CoinImage address={findPoolByAccount?.loanToken.loanToken || ""} />
            <CoinSymbol address={findPoolByAccount?.loanToken.loanToken || ""} />
          </div>
        )
      }
    },
    {
      accessorKey: "supplied",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Supplied"
        />
      ),
      cell: ({ row }) => {
        const findPoolByAccount = poolData.find(pool => pool.id === row.original.poolId)

        const totalSupplyShares = row.original.shares && row.original.shares
         / (findPoolByAccount?.totalSupplyAssets ?? 0) *(findPoolByAccount?.totalSupplyShares ?? 1)

        return (
        <div className="flex items-center gap-2">
          <span>{formatNumberWithDots(Number(normalize(totalSupplyShares ?? 0, 6))) || ""}</span>
        </div>
      )}
    },
  ];
}