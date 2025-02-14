import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ColumnHeader";
import { EarnSchema, PoolSchema } from "@/lib/validation/types";
import { CoinImage } from "@/components/coin/CoinImage";
import { CoinSymbol } from "@/components/coin/CoinSymbol";
import SkeletonWrapper from "@/components/loader/SkeletonWrapper";

export function columns({ dataPool, isLoadingPool }: { dataPool: PoolSchema[], isLoadingPool: boolean }): ColumnDef<EarnSchema>[] {
  return [
    {
      accessorKey: "Asset",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Asset"
        />
      ),
      cell: ({ row }) => {
        return (
          <SkeletonWrapper isLoading={isLoadingPool}>
            <div className="flex items-center gap-2">
              <CoinImage address={row.original.asset || ""} />
              <CoinSymbol address={row.original.asset || ""} />
            </div>
          </SkeletonWrapper>
        )
      },
    },
    {
      accessorKey: "Name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Name"
        />
      ),
      cell: ({ row }) => {
        return (
          <SkeletonWrapper isLoading={isLoadingPool}>
            <span>{row.original.name}</span>
          </SkeletonWrapper>
        )
      },
    },
    {
      accessorKey: "pools",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Pools"
        />
      ),
      cell: ({ row }) => {
        return (
          <SkeletonWrapper isLoading={isLoadingPool}>
            <div className="flex flex-wrap gap-1">
              {row.original.pools && row.original.pools.map((pool, index) => {
                const findPoolById = dataPool && dataPool.find((datPool) => datPool.id?.toLowerCase() === pool as any);
                return (
                  <div
                    key={`${pool.id}-${index}`}
                    className="px-2 py-0.5 text-sm flex flex-row gap-1 items-center"
                  >
                    <CoinImage address={findPoolById?.collateralToken.collateralToken || ""} />
                    <CoinSymbol address={findPoolById?.collateralToken.collateralToken || ""} />
                  </div>
                )
              })}
            </div>
          </SkeletonWrapper>
        )
      },
    },
    {
      accessorKey: "APY",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="APY"
          className="justify-end"
        />
      )
    },
    {
      accessorKey: "TVL",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="TVL"
          className="justify-end"
        />
      ),
    }
  ];
}