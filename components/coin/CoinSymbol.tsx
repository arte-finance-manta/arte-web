import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { useCryptoToken } from "@/hooks/useCryptoToken";

export const CoinSymbol = ({ address, className }: { address: string, className?: string }) => {
    const { cryptoTokenData } = useCryptoToken();

    const coinSymbolByAddress = cryptoTokenData && cryptoTokenData.find(
        (coin) => coin.contract_address[0].contract_address.toLowerCase() === address?.toLowerCase()
    )?.symbol;

    return (
        <Label className={cn("cursor-pointer", className)}>{coinSymbolByAddress}</Label>
    );
};
