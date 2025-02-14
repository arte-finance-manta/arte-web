import { API_SUBGRAPH } from "@/constants/config";
import { querySupplyCollaterals } from "@/graphql/query";
import { PoolSchema } from "@/lib/validation/types";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

type QueryData = {
    supplyCollaterals: PoolSchema[];
};

export default function useSupplyCollaterals() {
    const { data, isLoading: supplyCollateralsLoading, isRefetching: supplyCollateralsRefetching } = useQuery<QueryData>({
        queryKey: ["supplyCollaterals"],
        queryFn: async () => {
            return await request(API_SUBGRAPH, querySupplyCollaterals);
        },
        refetchInterval: 600000000,
    });

    const supplyCollateralsData: PoolSchema[] = data?.supplyCollaterals || [];

    return {
        supplyCollateralsData,
        supplyCollateralsLoading,
        supplyCollateralsRefetching
    }
}
