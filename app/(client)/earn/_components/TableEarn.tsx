"use client";

import { columns } from "@/components/tables/earn/columns";
import { DataTable } from "@/components/tables/earn/DataTable";
import { useEffect, useState } from "react";
import useEarn from "@/hooks/graphql/useEarn";
import usePools from "@/hooks/graphql/usePools";

export default function TablePool() {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const { earnData, earnLoading } = useEarn()
    const { poolData, poolLoading } = usePools()

    if (!hasMounted) {
        return null;
    }

    return (
        <div className="w-full space-y-4 h-auto z-10">
            <DataTable
                data={earnData || []}
                columns={columns({dataPool: poolData, isLoadingPool: poolLoading})}
                isLoading={earnLoading}
            />
        </div>
    );
}
