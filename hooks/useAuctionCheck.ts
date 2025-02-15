import { useQuery } from "@tanstack/react-query"

export const useAuctionCheck = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["oracle"],
        queryFn: async () => {
            const response = await fetch(
                `/api/auction-check`
            )
            return response.json()
        },
        refetchInterval: 10000
    })

    return { data, isLoading }
}