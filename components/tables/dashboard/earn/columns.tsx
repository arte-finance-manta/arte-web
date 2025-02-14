import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ColumnHeader";
import { EarnSchema } from "@/lib/validation/types";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { formatAddress } from "@/lib/utils";

export function columns(): ColumnDef<EarnSchema>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Curator"
        />
      ),
      cell: ({ row }) => {
        return (
          <div onClick={() => window.location.href = `/pools/${row.original.id}`}>
            <Button variant={"ghost"} className="p-1 px-2 py-2">
              <div className="flex items-center gap-1">
                <span>{formatAddress(row.original.id, 6)}</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </Button>
          </div >
        )
      },
    },
    {
      accessorKey: "apr",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="APR"
        />
      )
    },
    {
      accessorKey: "supplied",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Supplied"
          className="justify-end"
        />
      ),
    }
  ];
}