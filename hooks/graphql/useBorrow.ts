import { API_SUBGRAPH } from "@/constants/config";
import { queryBorrow } from "@/graphql/query";
import { BorrowSchema } from "@/lib/validation/types";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

type QueryData = {
    borrows: BorrowSchema[];
};

export default function useBorrows() {
    const { data, isLoading: borrowLoading, isRefetching: borrowRefetching } = useQuery<QueryData>({
        queryKey: ["borrow"],
        queryFn: async () => {
            return await request(API_SUBGRAPH, queryBorrow);
        },
        refetchInterval: 600000000,
    });

    const borrowData: BorrowSchema[] = data?.borrows || [];

    return {
        borrowData,
        borrowLoading,
        borrowRefetching
    }
}
