import dynamic from "next/dynamic";
import React from "react";
import { Label } from "../ui/label";

const Banknote = dynamic(() => import("lucide-react").then((mod) => mod.Banknote), { ssr: false });

export const WarningConnectWallet = () => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
                <Banknote className="w-20 h-20" />
                <Label>Please connect your wallet to view this page</Label>
            </div>
        </div>
    );
};
