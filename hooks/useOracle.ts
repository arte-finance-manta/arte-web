import { CoinMarketCapSchema } from "@/lib/validation/types"
import { useQuery } from "@tanstack/react-query"

export const useOracle = () => {
    const { data: oracleData, isLoading: oracleLoading } = useQuery<CoinMarketCapSchema[]>({
        queryKey: ["oracle"],
        queryFn: async () => {
            const response = await fetch(
                `https://gist.githubusercontent.com/FjrREPO/459be97ed2dc6ebbe64902c7955d82a2/raw/06122c09e80a4ae1e16869a953518e99b339c3d3/oracle.json`
            )
            return response.json()
        },
        refetchInterval: 600000000
    })

    return { oracleData, oracleLoading }
}