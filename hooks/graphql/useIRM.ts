import { API_SUBGRAPH } from "@/constants/config";
import { queryIRM } from "@/graphql/query";
import { IRMSchema } from "@/lib/validation/types"
import { useQuery } from "@tanstack/react-query"
import request from "graphql-request";

type QueryData = {
    interestRateModels: IRMSchema[];
};

export const useIRM = () => {
    const { data: irmDatas, isLoading: irmLoading } = useQuery<QueryData>({
        queryKey: ["irm"],
        queryFn: async () => {
            return await request(API_SUBGRAPH, queryIRM);
        },
        refetchInterval: 600000000
    })

    const irmData: IRMSchema[] = irmDatas?.interestRateModels || []

    return { irmData, irmLoading }
}