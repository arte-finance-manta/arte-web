import React from "react";
import Image from "next/image";
import { Network } from "lucide-react";

const NetworkImage = ({ chainId }: { chainId: number }) => {
    const networkLogos: { [key: string]: string } = {
        ethereum: "https://static.alchemyapi.io/images/emblems/eth-mainnet.svg",
        linea: "https://static.alchemyapi.io/images/emblems/linea-mainnet.svg",
    };

    const normalizedChain = chainId;
    const logoUrl = networkLogos[normalizedChain];

    return (
        <div className="flex items-center gap-2" >
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden" >
                {
                    logoUrl ? (
                        <Image
                            src={logoUrl}
                            alt={`${chainId} network`}
                            width={24}
                            height={24}
                            className="rounded-full"
                        />
                    ) : (
                        <Network className="w-4 h-4 text-gray-500" />
                    )}
            </div>
        </div>
    );
};

export default NetworkImage;