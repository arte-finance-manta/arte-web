import Image from "next/image";
import { cn } from "@/lib/utils";

export const NftImage = ({ path, className }: { path: string, className?: string }) => {
    const fallbackImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVYS7KEXYFAwqdRCW81e4DSR_nSLYSFStx1Q&s";

    return (
        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center outline outline-2", className)}>
            {path &&
                <Image
                    src={path ?? fallbackImage}
                    alt={path ?? "Default alt text"}
                    className={"rounded-full"}
                    width={24}
                    height={24}
                />
            }
        </div>
    );
};
