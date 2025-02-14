"use client";

import { columns } from "@/components/tables/dashboard/borrow/columns";
import { DataTable } from "@/components/tables/dashboard/borrow/DataTable";
import { AlchemyNftSchema, BorrowSchema, PoolSchema } from "@/lib/validation/types";

type Props = {
    borrowData: BorrowSchema[];
    borrowLoading: boolean;
    borrowRefetching: boolean;
    poolData: PoolSchema[];
    poolLoading: boolean;
    nftData: AlchemyNftSchema[];
    nftLoading: boolean;
};

export default function TableBorrow({ 
    borrowData, 
    borrowLoading, 
    borrowRefetching, 
    poolData, 
    poolLoading, 
    nftData, 
    nftLoading
}: Props) {
    return (
        <div className="w-full space-y-4 h-auto z-10">
            <DataTable
                data={borrowData || []}
                columns={columns({ 
                    poolData: poolData, 
                    poolLoading: poolLoading, 
                    nftData: nftData, 
                    nftLoading: nftLoading
                })}
                isLoading={borrowLoading || borrowRefetching}
            />
        </div>
    );
}
