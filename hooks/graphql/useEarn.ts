import { API_SUBGRAPH, API_SUBGRAPH_CURATOR } from "@/constants/config";
import { queryCurator } from "@/graphql/query";
import { EarnSchema } from "@/lib/validation/types";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

type QueryData = {
    curatorDeployeds: EarnSchema[];
};

export default function useEarn() {
    const { data, isLoading: earnLoading, isRefetching: earnRefetching } = useQuery<QueryData>({
        queryKey: ["earn"],
        queryFn: async () => {
            return await request(API_SUBGRAPH_CURATOR, queryCurator);
        },
        refetchInterval: 600000000,
    });

    const earnData: EarnSchema[] = data?.curatorDeployeds || [];

    return {
        earnData,
        earnLoading,
        earnRefetching
    }
}
