import { API_SUBGRAPH } from "@/constants/config";
import { queryLoanTokens } from "@/graphql/query";
import { LoanTokenSchema } from "@/lib/validation/types";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

type QueryData = {
    loanTokens: LoanTokenSchema[];
};

export default function useLoanTokens() {
    const { data, isLoading: loanTokensLoading } = useQuery<QueryData>({
        queryKey: ["loanTokens"],
        queryFn: async () => {
            return await request(API_SUBGRAPH, queryLoanTokens);
        },
        refetchInterval: 600000000,
    });

    const loanTokensData: LoanTokenSchema[] = data?.loanTokens || [];

    return {
        loanTokensData,
        loanTokensLoading
    }
}
