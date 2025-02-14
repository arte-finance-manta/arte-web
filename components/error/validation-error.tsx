import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const ValidationError = ({ message }: { message: string | null }) => {
    if (!message) return null;

    return (
        <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-sm text-red-500 leading-tight">
                        {message}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default ValidationError;