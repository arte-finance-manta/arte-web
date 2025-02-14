import { API_SUBGRAPH } from "@/constants/config";
import { queryLTV } from "@/graphql/query";
import { LTVSchema } from "@/lib/validation/types"
import { useQuery } from "@tanstack/react-query"
import request from "graphql-request";

type QueryData = {
    ltvs: LTVSchema[];
};

export const useLTV = () => {
    const { data: ltvDatas, isLoading: ltvLoading } = useQuery<QueryData>({
        queryKey: ["ltv"],
        queryFn: async () => {
            return await request(API_SUBGRAPH, queryLTV);
        },
        refetchInterval: 600000000
    })

    const ltvData: LTVSchema[] = ltvDatas?.ltvs || []

    return { ltvData, ltvLoading }
}