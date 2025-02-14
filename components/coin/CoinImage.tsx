import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCryptoToken } from "@/hooks/useCryptoToken";

export const CoinImage = ({ symbol, address, className }: { symbol?: string, address?: string, className?: string }) => {
    const fallbackImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVYS7KEXYFAwqdRCW81e4DSR_nSLYSFStx1Q&s";

    const { cryptoTokenData } = useCryptoToken();

    const coinLogoBySymbol = cryptoTokenData && cryptoTokenData?.find(
        (coin) => coin.symbol === symbol
    )?.logo;

    const coinLogoByAddress = cryptoTokenData && cryptoTokenData?.find(
        (coin) => coin.contract_address[0].contract_address.toLowerCase() === address?.toLowerCase()
    )?.logo;

    return (
        <div className={cn("w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer", className)}>
            {symbol ?
                <Image
                    src={coinLogoBySymbol ?? fallbackImage}
                    alt={coinLogoBySymbol ?? "Default alt text"}
                    className={"rounded-full"}
                    width={24}
                    height={24}
                />
                :
                <Image
                    src={coinLogoByAddress ?? fallbackImage}
                    alt={coinLogoByAddress ?? "Default alt text"}
                    className={"rounded-full"}
                    width={24}
                    height={24}
                />
            }
        </div>
    );
};
