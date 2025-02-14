import { API_SUBGRAPH } from "@/constants/config";
import { queryBids } from "@/graphql/query";
import { BidsSchema } from "@/lib/validation/types";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

type QueryData = {
    bids: BidsSchema[];
};

export default function useBids() {
    const { data, isLoading: bidsLoading, isRefetching: bidsRefetching } = useQuery<QueryData>({
        queryKey: ["bids"],
        queryFn: async () => {
            return await request(API_SUBGRAPH, queryBids);
        },
        refetchInterval: 5000
    });

    const bidsData: BidsSchema[] = data?.bids || [];

    return {
        bidsData,
        bidsLoading,
        bidsRefetching
    }
}
