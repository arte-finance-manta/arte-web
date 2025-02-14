import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ColumnHeader";
import { CoinImage } from "@/components/coin/CoinImage";
import { PoolSchema } from "@/lib/validation/types";
import { CoinSymbol } from "@/components/coin/CoinSymbol";

export function columns(): ColumnDef<PoolSchema>[] {
  return [
    {
      accessorKey: "collateral",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Collateral" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <CoinImage address={row.original.collateralToken.collateralToken || ""} />
          <CoinSymbol address={row.original.collateralToken.collateralToken || ""} />
        </div>
      ),
    },
    {
      accessorKey: "borrow",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Borrow" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.loanToken ? (
            <>
              <CoinImage address={row.original.loanToken.loanToken || ""} />
              <CoinSymbol address={row.original.loanToken.loanToken || ""} />
            </>
          ) : (
            <span>No Token</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "oracle",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Oracle" />
      ),
    },
    {
      accessorKey: "irm",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="IRM" />
      ),
    },
    {
      accessorKey: "lth",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="LTH" />
      ),
    },
    {
      accessorKey: "ltv",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="LTV"
          className="justify-end"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <span>{row.original.ltv}</span>
        </div>
      ),
    },
  ];
}