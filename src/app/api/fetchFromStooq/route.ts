import {NextResponse} from "next/server";
import {HistoricalPrice} from "@/types/stooq";
import {parseString} from "@fast-csv/parse";

export async function GET(req:Request){
    const {searchParams} = new URL(req.url);
    const ticker = searchParams.get("ticker");
    const purchaseDate = searchParams.get("purchaseDate");

    if(!ticker || !purchaseDate){
        return NextResponse.json({success:false, error:"no ticker or purchaseDate in params"},{status: 500});
    }

    const prices = await fetchFromStooq(ticker,purchaseDate);

    return NextResponse.json({success:true, prices },{status: 200});
}

async function fetchFromStooq(ticker: string,purchaseDate:string): Promise<HistoricalPrice[]> {
    const res = await fetch(`https://stooq.com/q/d/l/?s=${ticker}&i=d`);
    if (!res.ok) {
        throw new Error(`Error occurred while fetching ticker data ${ticker}`);
    }
    const csvText = await res.text();

    return new Promise((resolve, reject) => {
        const results: HistoricalPrice[] = [];

        parseString(csvText, { headers: true })
            .on("error", (err) => reject(err))
            .on("data", (row) => {
                if (row.Date >= purchaseDate) {
                    results.push({
                        date: row.Date,
                        close: parseFloat(row.Close),
                    });
                }
            })
            .on("end", () => {
                results.sort((a,b) => a.date.localeCompare(b.date));
                resolve(results);
            });
    });
}