"use client";

import { columns } from "@/components/tables/earn/pool/columns";
import { DataTable } from "@/components/tables/earn/pool/DataTable";
import usePools from "@/hooks/graphql/usePools";
import { useEffect, useState } from "react";

export default function TablePool() {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const { poolData, poolLoading } = usePools()

    if (!hasMounted) {
        return null;
    }

    return (
        <div className="w-full space-y-4 h-auto z-10">
            <DataTable
                data={poolData || []}
                columns={columns()}
                isLoading={poolLoading}
            />
        </div>
    );
}
