"use client";

import { columns } from "@/components/tables/dashboard/lend/columns";
import { DataTable } from "@/components/tables/dashboard/lend/DataTable";
import { useEffect, useState } from "react";
import { AccountLendSchema, PoolSchema } from "@/lib/validation/types";

type Props = {
    poolData: PoolSchema[];
    poolLoading: boolean;
    accountLendData?: AccountLendSchema[];
    accountLendLoading: boolean;
    accountLendRefetching: boolean;
};

export default function TableLend({ poolData, poolLoading, accountLendData, accountLendLoading, accountLendRefetching }: Props) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return null;
    }

    return (
        <div className="w-full space-y-4 h-auto z-10">
            <DataTable
                data={accountLendData || []}
                columns={columns({
                    poolData: poolData,
                    poolLoading: poolLoading,
                })}
                isLoading={accountLendLoading || accountLendRefetching}
            />
        </div>
    );
}
