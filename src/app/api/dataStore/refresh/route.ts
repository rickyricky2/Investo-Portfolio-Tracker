import {NextResponse } from "next/server";
import {getCollection} from "@/lib/db";

export async function POST(){
    const dataStoreCollection = await getCollection("dataStore");
    const dataStore = await dataStoreCollection.find({}).toArray();

    for(const asset of dataStore){
        const res = await fetch(`/api/stockMarketAPI?dataType=prices&ticker=${asset.ticker}&country=${asset.country}`, {
            method: "GET",
            headers:{"Content-Type": "application/json"},
        });
        if(!res.ok){
            console.warn("could not fetch new price from API");
            continue;
        }

        const data = await res.json();

        console.log(data);

        await dataStoreCollection.updateOne(
            {_id: asset._id},
            {$set: {lastUnitPrice: data.price}},
        );

        return NextResponse.json({success:"true"},{status:200});

    }
}