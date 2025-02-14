import { API_CRYPTOTOKEN } from "@/constants/config"
import { CoinMarketCapSchema } from "@/lib/validation/types"
import { useQuery } from "@tanstack/react-query"

export const useCryptoToken = () => {
    const { data: cryptoTokenData, isLoading: cryptoTokenLoading } = useQuery<CoinMarketCapSchema[]>({
        queryKey: ["cryptoToken"],
        queryFn: async () => {
            const response = await fetch(
                `${API_CRYPTOTOKEN}`
            )
            return response.json()
        },
        refetchInterval: 600000000
    })

    return { cryptoTokenData, cryptoTokenLoading }
}