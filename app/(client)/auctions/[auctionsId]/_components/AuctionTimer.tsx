import SkeletonWrapper from "@/components/loader/SkeletonWrapper";
import { AlertTriangle, Clock } from "lucide-react";
import { useState, useEffect } from "react";

export const AuctionTimer = ({
    endTime,
    isLoading
}: {
    endTime: string,
    isLoading: boolean
}) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [isAuctionEnded, setIsAuctionEnded] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const difference = new Date(endTime).getTime() - now.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setTimeLeft({ days, hours, minutes, seconds });
                setIsAuctionEnded(false);
            } else {
                setIsAuctionEnded(true);
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    if (isAuctionEnded) {
        return (
            <div className="bg-red-50 rounded-lg p-4 flex items-center justify-center text-red-600">
                <AlertTriangle className="mr-2" />
                <span className="font-semibold">Auction Ended</span>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg p-4 flex flex-row xl:flex-col flex-wrap gap-5 items-center justify-center lg:justify-center sm:justify-between shadow-sm">
            <div className="flex items-center space-x-2">
                <Clock className="text-primary w-6 h-6 animate-pulse" />
                <span className="font-semibold text-lg">Auction Ending In</span>
            </div>
            <div className="flex gap-2">
                {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="flex flex-col items-center">
                        <div className="bg-foreground/50 rounded-md p-1 min-w-[30px] text-center border border-primary/10">
                            <SkeletonWrapper isLoading={isLoading}>
                                <span className="text-2xl text-white font-bold text-primary">{value.toString().padStart(2, "0")}</span>
                            </SkeletonWrapper>
                        </div>
                        <span className="text-xs uppercase text-muted-foreground mt-1">
                            {unit === "days" ? "DAY" : unit === "hours" ? "HOUR" : unit === "minutes" ? "MIN" : "SEC"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}