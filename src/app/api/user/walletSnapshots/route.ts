import {NextResponse } from "next/server";
import {getCollection} from "@/lib/db";
import {ObjectId} from "mongodb";
import {parseString} from "@fast-csv/parse";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";
import {countrySuffixMap} from "@/content/assetContent";
import {HistoricalPrice} from "@/types/stooq";

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

const getUserId = async ()=>{
    const cookieStore = await cookies();
    const token = cookieStore.get("login_token")?.value;

    if(!token){
        throw new Error("Unauthorized");
    }
    const decoded = jwt.verify(token,process.env.LOGIN_SECRET!) as {
        userId:string,
        email:string
    };

    return decoded.userId;
}

function fillMissingDays(data: HistoricalPrice[]): HistoricalPrice[] {
    if (data.length === 0) return [];

    const parsed = data.map(p => ({
        date: new Date(p.date),
        close: p.close,
    }));

    const result: HistoricalPrice[] = [];
    let lastClose = parsed[0].close;

    for (let i = 0; i < parsed.length - 1; i++) {
        const current = parsed[i].date;
        const next = parsed[i + 1].date;

        result.push({
            date: current.toISOString().slice(0, 10),
            close: parsed[i].close,
        });

        lastClose = parsed[i].close;

        const day = new Date(current);
        day.setUTCDate(day.getUTCDate() + 1);

        while (day < next) {
            result.push({
                date: day.toISOString().slice(0, 10),
                close: lastClose,
            });
            day.setUTCDate(day.getUTCDate() + 1);
        }
    }

    const last = parsed[parsed.length - 1];
    result.push({
        date: last.date.toISOString().slice(0, 10),
        close: last.close,
    });

    return result;
}

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url);
    const id = searchParams.get("userId");

    if (!id){
        return NextResponse.json({ success: false, error: "Missing userId" },{status:400});
    }
    try {
        const userId = new ObjectId(id);
        const snapshotsCollection = await getCollection("portfolioSnapshots");
        const snapshots = await snapshotsCollection
            .find({ userId: userId })
            .sort({ date: 1 })
            .toArray();

        return NextResponse.json({ success: true, snapshots },{status:200});
    } catch (err:unknown) {
        console.error(err);
       return NextResponse.json({ success: false, error: "Server error" },{status:500});
    }
}

export async function POST() {
    try {
        const usersCollection = await getCollection("users");
        const users = await usersCollection.find({}).toArray();

        // we need to save exchange rates data so we fetch
        const res = await fetch(`https://api.frankfurter.app/latest?from=USD`);
        if (!res.ok) {
            return NextResponse.json({success: false, error: "Failed to fetch exchange rates"}, {status: 500});
        }
        const data = await res.json();
        const rates = data.rates;

        for (const user of users) {
            // we save user assets
            const assetsCollection = await getCollection("assets");
            const assets = await assetsCollection.find({userId: user._id}).toArray();

            // now we count wallet total value in USD (we will change currency to currency preffered by user when passing data to chart)
            const value = assets.reduce((sum, asset) => {
                if (asset.currency === "USD") {
                    return sum + Number(asset.lastUnitPrice) * Number(asset.quantity);
                }
                return sum + ((Number(asset.lastUnitPrice) / rates[asset.currency]) * Number(asset.quantity));
            }, 0);

            // we save value as snapshot
            const snapshotsCollection = await getCollection("portfolioSnapshots");
            await snapshotsCollection.updateOne(
                { userId: user._id, date: new Date().toISOString().split('T')[0]},
                { $set: { value } },
                { upsert: true },
            );
        }
        return NextResponse.json({success: true}, {status: 200});
    }catch(error:unknown){
        return NextResponse.json({success: false, error}, {status: 500});
    }
}

export async function PUT(req:Request){
    const {searchParams} = new URL(req.url);
    let ticker = searchParams.get("ticker");
    const ifDelete = searchParams.get("delete") === "true";
    const country = searchParams.get("country") || "";
    const purchaseDate = searchParams.get("purchaseDate");
    const quantity = Number(searchParams.get("quantity"));
    const purchasePrice = Number(searchParams.get("price"));
    const currency = searchParams.get("currency");

    if(!country || !quantity || !purchaseDate || !currency) {
        return NextResponse.json({success:false, error:"Could not find country, quantity, currency or purchaseDate in params"},{status:400});
    }

    const userId = new ObjectId( await getUserId() );

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    if(!ticker){
        if(!purchasePrice){
            return NextResponse.json({ success: false, error:"no price in params" },{status:500});
        }
        const ops = [];

        const currentDate = new Date(purchaseDate);
        const today = new Date();

        while(currentDate <= today ){
            let assetValue =  purchasePrice * quantity;
            const dateStr = currentDate.toISOString().split("T")[0];
            const res = await fetch(`${baseURL}/api/historicalRates?purchaseDate=${dateStr}`);
            const data = await res.json();
            if(currency !== "USD"){
                assetValue /= data.rates[currency];
            }
            ops.push({
                updateOne: {
                    filter: { userId, date: dateStr },
                    update: { $inc: { value: ifDelete ? -assetValue : assetValue } },
                    upsert: !ifDelete
                }
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        const portfolioSnapshots = await getCollection("portfolioSnapshots");
        await portfolioSnapshots.bulkWrite(ops);

        return NextResponse.json({ success: true },{status:200});
    }

    ticker = buildTicker(ticker,country);

    let allPrices: HistoricalPrice[] = await fetchFromStooq(ticker,purchaseDate);
    allPrices = fillMissingDays(allPrices);

    if (allPrices.length === 0) {
        return NextResponse.json({success: false, error:"No data"}, {status: 500});
    }

    const ops = await Promise.all(
        allPrices.map( async (price) => {
            let assetValue = price.close * quantity;
            const res = await fetch(`${baseURL}/api/historicalRates?purchaseDate=${price.date}`);
            const data = await res.json();
            if(currency !== "USD"){
                assetValue = Number(assetValue / Number(data.rates[currency]));
            }
            assetValue = Number(assetValue.toFixed(2));
            return {
                updateOne: {
                    filter: { userId, date: price.date },
                    update: { $inc: { value: ifDelete ? -assetValue : assetValue } },
                    upsert: !ifDelete
                }
            };
        })
    );

    const portfolioSnapshots = await getCollection("portfolioSnapshots");
    await portfolioSnapshots.bulkWrite(ops);

    return NextResponse.json({ success: true },{status:200});

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
                    if (row.Date >= purchaseDate && row.Date !== new Date().toISOString().split("T")[0]) {
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

}