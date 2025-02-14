import { API_SUBGRAPH } from "@/constants/config";
import { queryCollateralTokens } from "@/graphql/query";
import { CollateralTokenSchema } from "@/lib/validation/types";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

type QueryData = {
    collaterals: CollateralTokenSchema[];
};

export default function useCollateralTokens() {
    const { data, isLoading: collateralTokensLoading } = useQuery<QueryData>({
        queryKey: ["collateralTokens"],
        queryFn: async () => {
            return await request(API_SUBGRAPH, queryCollateralTokens);
        },
        refetchInterval: 600000000,
    });

    const collateralTokensData: CollateralTokenSchema[] = data?.collaterals || [];

    return {
        collateralTokensData,
        collateralTokensLoading
    }
}
