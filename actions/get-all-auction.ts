import { AuctionApiSchema } from "@/lib/validation/types";
import { useQuery } from "@tanstack/react-query"

export const getAllAuction = () => {
    const { data: auctionData, isLoading: auctionLoading } = useQuery<AuctionApiSchema[]>({
        queryKey: ["auctionApi"],
        queryFn: async () => {
            const url = "/api/auction";
            const response = await fetch(url);
            return response.json();
        }
    })

    return { auctionData, auctionLoading }
}