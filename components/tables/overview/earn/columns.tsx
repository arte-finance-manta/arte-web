import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ColumnHeader";
import { EarnSchema } from "@/lib/validation/types";
import { Label } from "@/components/ui/label";
import { CoinImage } from "@/components/coin/CoinImage";
import { CoinSymbol } from "@/components/coin/CoinSymbol";

export function columns(): ColumnDef<EarnSchema>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Name"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Label>{row.original.name}</Label>
        </div>
      ),
    },
    {
      accessorKey: "asset",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Asset"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <CoinImage address={row.original.asset || ""} />
          <CoinSymbol address={row.original.asset || ""} />
        </div>
      ),
    },
    {
      accessorKey: "APY",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="APY"
          className="justify-end"
        />
      ),
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