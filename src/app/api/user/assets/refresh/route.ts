import {NextResponse } from "next/server";
import {getCollection} from "@/lib/db";
// import {ObjectId} from "mongodb";

// this runs every day / once a day updates every asset price
export async function POST(){
    try {
        const assetsCollection = await getCollection("assets");
        const assets = await assetsCollection.find({addedManually: false}).toArray();

        const baseURL = process.env.PUBLIC_BASE_URL || "http://localhost:3000";

        for (const asset of assets) {
            const res = await fetch(`${baseURL}/api/dataStore?ticker=${asset.ticker}&country=${asset.country}`, {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            });
            if (!res.ok) {
                console.warn("could not fetch data from dataStore");
                continue;
            }

            const data = await res.json();

            if (!data.success) {
                console.warn("could not fetch data from dataStore");
                continue;
            }

            await assetsCollection.updateOne(
                {_id: asset._id},
                {$set: {lastUnitPrice: data.tickerInfo.lastUnitPrice,
                        dailyChange: data.tickerInfo.dailyChange,
                        dailyChangePercent: data.tickerInfo.dailyChangePercent,
                        updatedAt: new Date()}},
            );
        }
        return NextResponse.json({success: "true"}, {status: 200});
    }catch{
        return NextResponse.json({success: false, error:"server error occurred"}, {status: 500});
    }
}