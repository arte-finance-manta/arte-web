import React from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { decodeEventLog, Log } from "viem";
import { curatorABI } from "@/lib/abi/curatorABI";
import { serializeBigInt } from "@/lib/utils";

interface SuccessDialogProps {
    isOpen: boolean;
    onClose: () => void;
    txHash: HexAddress;
    processName: string;
    logs?: Log;
    enabledLogs?: boolean;
}

interface DecodedLogs {
    eventName: string;
    args: Args;
}

interface Args {
    curator: string;
    pools: string[];
    allocations: string[];
}

export const SuccessDialog: React.FC<SuccessDialogProps> = ({
    isOpen,
    onClose,
    txHash,
    processName,
    logs,
    enabledLogs = false
}) => {
    const [copied, setCopied] = React.useState(false);
    const [decodedLogs, setDecodedLogs] = React.useState<DecodedLogs | null>(null);
    const [decodeError, setDecodeError] = React.useState<string | null>(null);

    const explorerBaseUrl = "https://pacific-explorer.sepolia-testnet.manta.network";
    const explorerUrl = `${explorerBaseUrl}/tx/${txHash}`;
    const explorerUrlCurator = `${explorerBaseUrl}/address/${decodedLogs?.args.curator as string}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(txHash);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy to clipboard:", error);
        }
    };

    const handleCopyCurator = async () => {
        try {
            await navigator.clipboard.writeText(decodedLogs?.args.curator as string);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy to clipboard:", error);
        }
    };

    React.useEffect(() => {
        if (enabledLogs && logs) {
            try {
                const decoded = decodeEventLog({
                    abi: curatorABI,
                    data: logs.data,
                    topics: logs.topics,
                });
                const serializedLogs = serializeBigInt(decoded) as DecodedLogs;
                setDecodedLogs(serializedLogs as DecodedLogs);
                setDecodeError(null);
            } catch (error) {
                console.error("Failed to decode logs:", error);
                setDecodeError("Failed to decode transaction logs");
                setDecodedLogs(null);
            }
        }
    }, [enabledLogs, logs]);

    const openExplorer = () => {
        window.open(explorerUrl, "_blank", "noopener noreferrer");
    };

    const openExplorerCurator = () => {
        window.open(explorerUrlCurator, "_blank", "noopener noreferrer");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center">
                            <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <span>Transaction Successful!</span>
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <p className="text-sm text-gray-500">
                            {processName} has been completed successfully
                        </p>
                    </div>

                    <div className="rounded-lg p-4 space-y-2 ">
                        <div className="text-sm font-medium">Transaction Hash</div>
                        <div className="flex items-center gap-2 max-w-sm">
                            <code className="flex-1 font-mono text-xs p-2 rounded border overflow-x-auto">
                                {txHash}
                            </code>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCopy}
                                className="shrink-0 hover:bg-gray-100"
                                aria-label={copied ? "Copied!" : "Copy transaction hash"}
                            >
                                <Copy className={`h-4 w-4 ${copied ? "text-green-500" : "text-gray-500"}`} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={openExplorer}
                                className="shrink-0 hover:bg-gray-100"
                                aria-label="View in explorer"
                            >
                                <ExternalLink className="h-4 w-4 text-gray-500" />
                            </Button>
                        </div>
                    </div>

                    {enabledLogs && (
                        <div className="rounded-lg p-4 space-y-2">
                            <div className="text-sm font-medium">Curator Address</div>
                            <div className="flex items-center gap-2 max-w-sm">
                                {decodeError ? (
                                    <p className="text-sm text-red-500">{decodeError}</p>
                                ) : (
                                    <>
                                        <code className="flex-1 font-mono text-xs p-2 rounded border overflow-x-auto">
                                            {decodedLogs ? decodedLogs.args.curator : "No logs available"}
                                        </code>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleCopyCurator}
                                            className="shrink-0 hover:bg-gray-100"
                                            aria-label={copied ? "Copied!" : "Copy transaction hash"}
                                        >
                                            <Copy className={`h-4 w-4 ${copied ? "text-green-500" : "text-gray-500"}`} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={openExplorerCurator}
                                            className="shrink-0 hover:bg-gray-100"
                                            aria-label="View in explorer"
                                        >
                                            <ExternalLink className="h-4 w-4 text-gray-500" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center pt-2">
                        <Button
                            className="w-32"
                            onClick={onClose}
                            variant="default"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SuccessDialog;