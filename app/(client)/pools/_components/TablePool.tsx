"use client";

import { columns } from "@/components/tables/pool/columns";
import { DataTable } from "@/components/tables/pool/DataTable";
import { useEffect, useState } from "react";
import usePools from "@/hooks/graphql/usePools";

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
