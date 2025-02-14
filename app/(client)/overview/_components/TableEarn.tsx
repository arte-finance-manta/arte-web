"use client";

import { columns } from "@/components/tables/overview/earn/columns";
import { DataTable } from "@/components/tables/overview/earn/DataTable";
import { useEffect, useState } from "react";
import useEarn from "@/hooks/graphql/useEarn";

export default function TableEarn() {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const { earnData, earnLoading } = useEarn()

    if (!hasMounted) {
        return null;
    }

    return (
        <div className="w-full space-y-4 h-auto z-10">
            <DataTable
                data={earnData || []}
                columns={columns()}
                isLoading={earnLoading}
            />
        </div>
    );
}
