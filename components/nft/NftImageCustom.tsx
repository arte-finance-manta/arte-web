import Image from "next/image";
import { cn } from "@/lib/utils";

export const NftImageCustom = ({ path, className }: { path: string, className?: string }) => {
    const fallbackImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVYS7KEXYFAwqdRCW81e4DSR_nSLYSFStx1Q&s";

    return (
        <div className={"rounded-full flex items-center justify-center outline outline-2 w-fit h-fit"}>
            {path &&
                <Image
                    src={path ?? fallbackImage}
                    alt={path ?? "Default alt text"}
                    className={cn("rounded-full", className)}
                    width={96}
                    height={96}
                />
            }
        </div>
    );
};
