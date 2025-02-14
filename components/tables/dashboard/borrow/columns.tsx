import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ColumnHeader";
import { AlchemyNftSchema, BorrowSchema, PoolSchema } from "@/lib/validation/types";
import { CoinImage } from "@/components/coin/CoinImage";
import { CoinSymbol } from "@/components/coin/CoinSymbol";
import SkeletonWrapper from "@/components/loader/SkeletonWrapper";
import { formatAddress, formatNumberWithDots } from "@/lib/utils";
import { NftImage } from "@/components/nft/NftImage";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import PriceOracleCell from "./PriceOracleCell";
import { normalize } from "@/lib/helper/bignumber";

type Props = {
  poolData: PoolSchema[];
  poolLoading: boolean;
  nftData: AlchemyNftSchema[]
  nftLoading: boolean;
};

export function columns({ poolData, poolLoading, nftData, nftLoading }: Props): ColumnDef<BorrowSchema>[] {
  return [
    {
      accessorKey: "poolId",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Pool"
        />
      ),
      cell: ({ row }) => {
        return (
          <div onClick={() => window.location.href = `/pools/${row.original.poolId}`}>
            <Button variant={"ghost"} className="p-1 px-2 py-2">
              <div className="flex items-center gap-1">
                <span>{formatAddress(row.original.poolId, 6)}</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </Button>
          </div >
        )
      },
    },
    {
      accessorKey: "tokenId",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Collateral"
        />
      ),
      cell: ({ row }) => {
        const findNftByTokenId = nftData.find((nft) => nft.tokenId === row.original.tokenId)
        return (
          <div className="flex items-center gap-2">
            <SkeletonWrapper isLoading={nftLoading}>
              <div className="flex flex-row items-center gap-2">
                <NftImage path={findNftByTokenId?.contract.openSeaMetadata.imageUrl || ""} />
                <span>{row.original.tokenId}</span>
              </div>
            </SkeletonWrapper>
          </div>
        )
      },
    },
    {
      accessorKey: "collateralValue",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Collateral Value"
        />
      ),
      cell: ({ row }) => {
        const findPoolById = poolData.find((pool) => pool.id === row.original.poolId)

        const oracleAddress = findPoolById?.oracle as HexAddress || "";
        const loanTokenAddress = findPoolById?.loanToken.loanToken || "";

        return (
          <SkeletonWrapper isLoading={poolLoading}>
            <PriceOracleCell oracleAddress={oracleAddress} loanTokenAddress={loanTokenAddress} />
          </SkeletonWrapper>
        )
      },
    },
    {
      accessorKey: "liquidationValue",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Liquidation Value"
        />
      ),
      cell: ({ row }) => {
        const findPoolById = poolData.find((pool) => pool.id === row.original.poolId)

        const liquidationValue = (parseInt(findPoolById?.lth as string) * (parseInt(row.original.amount || "0"))) / 100

        return (
          <div className="flex items-center gap-2">
            <SkeletonWrapper isLoading={poolLoading}>
              <span>{liquidationValue && formatNumberWithDots(liquidationValue || 0)}</span>
            </SkeletonWrapper>
          </div>
        )
      },
    },
    {
      accessorKey: "borrowRate",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Borrow Rate"
        />
      ),
      cell: ({ row }) => {
        const findPoolById = poolData.find((pool) => pool.id === row.original.poolId)
        return (
          <div className="flex items-center gap-2">
            <SkeletonWrapper isLoading={poolLoading}>
              <span>{formatNumberWithDots((parseInt(normalize(findPoolById?.borrowRate?.toString() || "0", 16))) || 0)}%</span>
            </SkeletonWrapper>
          </div>
        )
      },
    },
    {
      accessorKey: "loanToken",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Loan Token"
        />
      ),
      cell: ({ row }) => {
        const findPoolById = poolData.find((pool) => pool.id === row.original.poolId)
        return (
          <div className="flex items-center gap-2">
            <CoinImage address={findPoolById?.loanToken.loanToken || ""} />
            <CoinSymbol address={findPoolById?.loanToken.loanToken || ""} />
          </div>
        )
      },
    },
    {
      accessorKey: "borrowed",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Borrowed"
          className="justify-end"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 justify-end">
            <SkeletonWrapper isLoading={poolLoading}>
              <span>{row.original.amount && formatNumberWithDots(parseInt(normalize(row.original.amount || "0", 6)) || 0)}</span>
            </SkeletonWrapper>
          </div>
        )
      },
    }
  ];
}