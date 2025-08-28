import {NextResponse } from "next/server";
import {getCollection} from "@/lib/db";
// import {ObjectId} from "mongodb";

// this runs every day / once a day updates every asset price
export async function POST(){
    const assetsCollection = await getCollection("assets");
    const assets = await assetsCollection.find({addedManually:false}).toArray();

    for(const asset of assets) {
        try{
            const res = await fetch(`/api/dataStore?ticker=${asset.ticker}&country=${asset.country}`,{
                method: "GET",
                headers: {"Content-Type": "application/json"},
            });
            if(!res.ok){
                console.warn("could not fetch data from dataStore");
                continue;
            }

            const data = await res.json();

            if(!data.success){
                console.warn("could not fetch data from dataStore");
                continue;
            }

            const newPrice = data.tickerInfo.lastUnitPrice;

            await assetsCollection.updateOne(
                {_id: asset._id},
                {$set: {lastUnitPrice: newPrice, updatedAt: new Date()}},
            );

            return NextResponse.json({success:"true"},{status:200});
        }catch{
            return NextResponse.json({success: false, error:"server error occurred"}, {status: 500});
        }
    }
}