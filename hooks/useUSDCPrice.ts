import { useQuery } from "@tanstack/react-query"

const API_PRICEUSDC = "https://coins.llama.fi/prices/current/base:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"

type TokenPrice = {
  coins: Coins;
}

type Coins = {
  "base:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913": Base0X833589FCD6EDb6E08F4C7C32D4F71B54BdA02913;
}

type Base0X833589FCD6EDb6E08F4C7C32D4F71B54BdA02913 = {
  decimals:   number;
  symbol:     string;
  price:      number;
  timestamp:  number;
  confidence: number;
}

export const useUSDCPrice = () => {
    const { data: priceToken, isLoading: priceLoading } = useQuery<TokenPrice>({
        queryKey: ["usdcPrice"],
        queryFn: async () => {
            const response = await fetch(
                `${API_PRICEUSDC}`
            )
            return response.json()
        },
        refetchInterval: 600000000
    })

    const priceData = priceToken?.coins["base:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"]

    return { priceData, priceLoading }
}