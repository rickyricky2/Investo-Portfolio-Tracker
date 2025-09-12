import {NextResponse} from "next/server";
import { parse } from "csv-parse/sync";
import { parseString } from "@fast-csv/parse";
import {latestRecord, historicalRecord} from "@/types/stooq";
import {countrySuffixMap} from "@/content/assetContent";

const twelvedata_token = process.env.TWELVEDATA_API_KEY;

function buildTicker(symbol: string, countryName: string): string {
    if(countryName === "Poland"){
        return symbol;
    }
    const suffix = countrySuffixMap[countryName];
    if (!suffix) {
        throw new Error(`No data for this country stock market: ${countryName}`);
    }
    return `${symbol}.${suffix}`;
}

async function getRecordByDate(ticker: string, date: string): Promise<historicalRecord | null> {
    const res = await fetch(`https://stooq.com/q/d/l/?s=${ticker}&i=d`);
    if (!res.ok) {
        throw new Error(`Error occurred while fetching ticker data ${ticker}`);
    }
    const csvText = await res.text();

    return new Promise((resolve, reject) => {
        let found: historicalRecord | null = null;

        parseString<historicalRecord, historicalRecord>(csvText, { headers: true })
            .on("error", (err) => reject(err))
            .on("data", (row) => {
                if (row.Date === date) {
                    found = row;
                }
            })
            .on("end", () => resolve(found));
    });
}

export async function GET(req:Request){

    const {searchParams} = new URL(req.url);
    const dataType = searchParams.get("dataType");
    let ticker = searchParams.get("ticker");
    let country = searchParams.get("country") || "";
    const purchaseDate = searchParams.get("purchaseDate");

    if(!ticker || !country){
        return NextResponse.json({success:false, error:"Could not find token or country in params"},{status:400});
    }
    ticker = buildTicker(ticker,country);
    country = encodeURIComponent(country);

    if(dataType === "lastPrice"){
        const res = await fetch(`https://stooq.com/q/l/?s=${ticker}&f=sd2t2ohlcv&h&e=csv`);
        if (!res.ok) {
            throw new Error(`Error occurred while fetching ticker data ${ticker}`);
        }
        const data = await res.text();
        if(!data){
            return NextResponse.json({success:false, error:"We couldn't fetch ticker info"},{status:500});
        }
        const record = parse(data, { columns: true })[0] as latestRecord;

        if(record) {
            const lastPrice = Number(Number(record.Close).toFixed(2));
            return NextResponse.json({success: true, lastPrice}, {status: 200});
        }
    }else if(dataType === "historicalPrices"){
        if(!purchaseDate){
            return NextResponse.json({success:false, error:"Could not find purchaseDate in params"},{status:400});
        }
        const record = await getRecordByDate(ticker, purchaseDate);
        if(record) {
            const price = Number(Number(record.Close).toFixed(2));
            return NextResponse.json({success: true, price: price}, {status: 200});
        }
    }else {
        const tickerInfoUrl = `https://api.twelvedata.com/quote?symbol=${ticker}&apikey=${twelvedata_token}&country=${country}`;
        const res = await fetch(tickerInfoUrl);

        if (res.ok) {
            const data = await res.json();
            if (data.status !== "error") {
                return NextResponse.json({success: true, tickerInfo: data}, {status: 200});
            }
        }
    }
    return NextResponse.json({success:false, error:"We couldn't fetch ticker info"},{status:500});
}