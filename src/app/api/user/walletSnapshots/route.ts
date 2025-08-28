import {NextResponse } from "next/server";
import clientPromise from "@/lib/db";

async function getCollection(str:string) {
    const client = await clientPromise;
    const db = client.db("investodb");
    return db.collection(str);
}

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId){
        return NextResponse.json({ success: false, error: "Missing userId" },{status:400});
    }
    try {
        const snapshotsCollection = await getCollection("portfolioSnapshots");
        const snapshots = await snapshotsCollection
            .find({ userId: userId.toString() })
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
            await snapshotsCollection.insertOne({
                userId: user._id,
                date: new Date(),
                value
            });
        }
        return NextResponse.json({success: true}, {status: 200});
    }catch(error:unknown){
        return NextResponse.json({success: false, error}, {status: 500});
    }
}