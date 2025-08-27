import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";


function isOlderThanOneHour(updatedAt: Date): boolean {
    const oneHour = 1000 * 60 * 60;
    return new Date().getTime() - new Date(updatedAt).getTime() > oneHour;
}

async function getExchangeRates() {
    const client = await clientPromise;
    const db = client.db("investodb");
    return db.collection("exchangeRates");
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const base = searchParams.get("base");
        const mainCurrency = searchParams.get("mainCurrency");

        if (!base || !mainCurrency) {
            return NextResponse.json({success:false, error: "Missing base or mainCurrency" }, { status: 400 });
        }

        const exchangeRates = await getExchangeRates();
        const existing = await exchangeRates.findOne({ base, mainCurrency });

        if (!existing) {
            const freshData = await fetchFromApi(base, mainCurrency);
            await exchangeRates.insertOne({ base, mainCurrency, rate: freshData, updatedAt: new Date() });
            return NextResponse.json({success:true, freshData},{status:200});
        }

        if (isOlderThanOneHour(existing.updatedAt)) {
            const freshData = await fetchFromApi(base, mainCurrency);
            await exchangeRates.updateOne(
                { _id: existing._id },
                { $set: { rate: freshData, updatedAt: new Date() } }
            );
            return NextResponse.json({success:true, freshData},{status:200});
        }

        // Jeśli są świeże dane → zwracamy z bazy
        return NextResponse.json({success:true, rate:existing.rate},{status:200});

    } catch (error) {
        console.error(error);
        return NextResponse.json({success:false, error: "Internal server error" }, { status: 500 });
    }
}

// helper: pobiera kursy z zewnętrznego API
async function fetchFromApi(base: string, mainCurrency: string) {
    const exchangeRatesURL = `https://api.frankfurter.app/latest?from=${base}&to=${mainCurrency}`;
    const res = await fetch(exchangeRatesURL);
    if (!res.ok) {
        throw new Error("Failed to fetch exchange rates");
    }
    const data = await res.json();
    return data.rates[mainCurrency];
}