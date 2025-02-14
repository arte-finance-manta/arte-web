import { API_SUBGRAPH } from "@/constants/config";
import { queryTokens } from "@/graphql/query";
import { TokensSchema } from "@/lib/validation/types"
import { useQuery } from "@tanstack/react-query"
import request from "graphql-request";

type QueryData = {
    tokens: TokensSchema[];
};

export const useTokens = () => {
    const { data: tokensDatas, isLoading: tokensLoading } = useQuery<QueryData>({
        queryKey: ["tokens"],
        queryFn: async () => {
            return await request(API_SUBGRAPH, queryTokens);
        },
        refetchInterval: 600000000
    })

    const tokensData: TokensSchema[] = tokensDatas?.tokens || []

    return { tokensData, tokensLoading }
}