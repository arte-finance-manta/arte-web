import { API_SUBGRAPH } from "@/constants/config";
import { queryPosition } from "@/graphql/query";
import { PositionSchema } from "@/lib/validation/types"
import { useQuery } from "@tanstack/react-query"
import request from "graphql-request";
import { useAccount } from "wagmi";

type QueryData = {
    positions: PositionSchema[];
};

export const usePosition = (poolId: string) => {
    const { address: account } = useAccount()

    const { data, isLoading: positionLoading } = useQuery<QueryData>({
        queryKey: ["position", account, poolId],
        queryFn: async () => {
            return await request(API_SUBGRAPH, queryPosition(account as HexAddress, poolId));
        },
        refetchInterval: 600000000
    })
    
    const positionData: PositionSchema[] = data?.positions || []

    return { positionData, positionLoading }
}