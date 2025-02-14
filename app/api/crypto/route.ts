import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const symbol = req.nextUrl.searchParams.get("symbol");
    const address = req.nextUrl.searchParams.get("address");

    if (!symbol && !address) {
        return NextResponse.json({ error: "Either symbol or address is required" }, { status: 400 });
    }

    const params = new URLSearchParams();
    if (symbol !== "" && symbol !== null) {
        params.append("symbol", symbol.toUpperCase());
    }
    if (address !== null && address !== "") {
        params.append("address", address);
    }

    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?${params.toString()}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-CMC_PRO_API_KEY": process.env.NEXT_PUBLIC_CMC_API_KEY || "40ca06ad-e462-4bf4-8e59-09a5b5a16f09",
        },
    });

    if (!res.ok) {
        const errorData = await res.json();
        return NextResponse.json({ error: errorData.status.error_message }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
};
