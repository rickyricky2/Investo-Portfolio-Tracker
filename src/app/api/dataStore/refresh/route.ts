import {NextResponse } from "next/server";
import {getCollection} from "@/lib/db";

export async function POST(){
    const dataStoreCollection = await getCollection("dataStore");
    const dataStore = await dataStoreCollection.find({}).toArray();

    const baseURL = process.env.PUBLIC_BASE_URL || "http://localhost:3000";

    for(const asset of dataStore){
        const res = await fetch(`${baseURL}/api/stockMarketAPI?ticker=${asset.ticker}&country=${encodeURIComponent(asset.country)}`, {
            method: "GET",
            headers:{"Content-Type": "application/json"},
        });
        if(!res.ok){
            console.warn("could not fetch new price from API");
            continue;
        }

        const data = await res.json();

        await dataStoreCollection.updateOne(
            {_id: asset._id},
            {$set: {
                    lastUnitPrice: data.tickerInfo.close,
                    dailyChange: data.tickerInfo.change,
                    dailyChangePercent: data.tickerInfo.percent_change,
                    updatedAt: new Date()
                }
            },
        );

        return NextResponse.json({success:"true"},{status:200});

    }
}