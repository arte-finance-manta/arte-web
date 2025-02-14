import { API_SUBGRAPH } from "@/constants/config";
import { queryPool } from "@/graphql/query";
import { PoolSchema } from "@/lib/validation/types";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

type QueryData = {
  pools: PoolSchema[];
};

export default function usePools() {
  const {
    data,
    isLoading: poolLoading,
    isRefetching: poolRefetching,
    ...rest
  } = useQuery<QueryData>({
    queryKey: ["pool"],
    queryFn: async () => {
      return await request(API_SUBGRAPH, queryPool);
    },
    refetchInterval: 600000000,
  });

  const poolData: PoolSchema[] = data?.pools || [];

  return {
    poolData,
    poolLoading,
    poolRefetching,
    ...rest,
  };
}
