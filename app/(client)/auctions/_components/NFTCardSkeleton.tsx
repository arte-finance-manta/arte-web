import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const NFTCardSkeleton: React.FC = () => {
    return (
        <Card className="w-full max-w-sm">
            <CardContent className="p-4">
                <div className="relative mb-4">
                    <Skeleton className="w-full aspect-square rounded-lg" />
                    <Skeleton className="absolute top-2 right-2 w-12 h-6 rounded-full" />
                </div>

                <div className="space-y-2 mb-4">
                    <Skeleton className="h-5 w-3/4" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                </div>

                <Skeleton className="mt-4 h-10 w-full" />
            </CardContent>
        </Card>
    );
};