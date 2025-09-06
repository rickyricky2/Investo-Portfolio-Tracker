import { NextResponse } from "next/server";
import {getCollection} from "@/lib/db";

export async function POST(req:Request){
    try{
        const { searchParams } = new URL(req.url);
        const purchaseDate = searchParams.get("purchaseDate") as string;
        if(!purchaseDate){
            return NextResponse.json({success:false, error: "Could not find required parameters in url" }, { status: 400 });
        }
        const exchangeRatesURL = `https://api.frankfurter.app/${purchaseDate}?from=USD`;
        const res = await fetch(exchangeRatesURL);
        if (!res.ok) {
            return NextResponse.json({success:false, error: "Could not fetch rates" }, { status: 500 });
        }
        const data = await res.json();

        const historicalRates = await getCollection("historicalRates");
        const rate = await historicalRates.findOne({date:data.date});
        if(rate){
            return NextResponse.json({success:false, error: "We already have this rates stored" }, { status: 400 });
        }
        await historicalRates.insertOne({
            base:"USD",
            date:data.date,
            rates:data.rates,
            createdAt: new Date(),
        });
        return NextResponse.json({success:true }, { status: 200 });

    }catch(error:unknown){
        console.error(error);
        return NextResponse.json({success:false, error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req:Request){
    try{
        const { searchParams } = new URL(req.url);
        const purchaseDate = searchParams.get("purchaseDate");
        if(!purchaseDate){
            return NextResponse.json({success:false, error: "Could not find required parameters in url" }, { status: 400 });
        }
        const historicalRates = await getCollection("historicalRates");
        const rate = await historicalRates.findOne({date:purchaseDate});

        if(!rate){
            const exchangeRatesURL = `https://api.frankfurter.app/${purchaseDate}?from=USD`;
            const res = await fetch(exchangeRatesURL);
            if (!res.ok) {
                return NextResponse.json({success:false, error: "Could not fetch rates" }, { status: 500 });
            }
            const data = await res.json();
            await historicalRates.insertOne({
                base:"USD",
                date:data.date,
                rates:data.rates,
                createdAt: new Date(),
            });
            return NextResponse.json({success:true, rates:data.rates }, { status: 200 });
        }
        return NextResponse.json({success:true, rates:rate.rates }, { status: 200 });

    }catch(error:unknown){
        console.error(error);
        return NextResponse.json({success:false, error: "Internal server error" }, { status: 500 });
    }
}