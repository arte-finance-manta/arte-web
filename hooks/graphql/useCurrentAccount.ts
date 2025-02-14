import { API_SUBGRAPH } from "@/constants/config";
import { queryAccount } from "@/graphql/query";
import { AccountSchema } from "@/lib/validation/types";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount } from "wagmi";

type QueryData = {
    account: AccountSchema;
};

export default function useCurrentAccount() {
    const { address } = useAccount();

    const { data, isLoading: accountLoading, isRefetching: accountRefetching } = useQuery<QueryData>({
        queryKey: ["account"],
        queryFn: async () => {
            return await request(API_SUBGRAPH, queryAccount(address as HexAddress));
        },
        refetchInterval: 600000000,
    });

    const accountData: AccountSchema = data?.account || { id: "", lend: [], positions: [], earn: [] };

    return {
        accountData,
        accountLoading,
        accountRefetching
    }
}
