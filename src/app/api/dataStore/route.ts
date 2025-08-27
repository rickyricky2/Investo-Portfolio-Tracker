import {NextResponse} from "next/server";
import clientPromise from "@/lib/db";
import {connectWS,subscribeTicker,unsubscribeTicker} from "@/lib/finnhub-ws";

async function getDataStore() {
    const client = await clientPromise;
    const db = client.db("investodb");
    return db.collection("dataStore");
}

// const ws = connectWS();

export async function GET(req:Request){

    const {searchParams} = new URL(req.url);
    const ticker = searchParams.get("ticker");
    const country = searchParams.get("country");

    // connecting to db
    try {
        // check if we have data with this ticker in db
        const dataStore = await getDataStore();

        let data = await dataStore.findOne({ticker: ticker, country: country});

        if (data) {
            // if yes we need to check if last update time is more than one hour
            const lastUpdatedAt = data.updatedAt.getTime();
            const date = new Date().getTime();

            const timeDiff = date - lastUpdatedAt;
            if( timeDiff >= 1000 * 60 * 60){
            //     if last price update was more than one hour ago we need to fetch new data
                return NextResponse.json({success: false,code:"expired",tickerInfo: data, error:"ticker prices expired. need to fetch for last prices"}, {status: 500});
            }
            // if we have actual data in dataStore we can send it back
            return NextResponse.json({success: true, tickerInfo: data}, {status: 200});
        }
        // if no
        return NextResponse.json({success: false,code:"no data", error:"we don't store this ticker in database"}, {status: 500});

    }catch(e:any){
        console.error(e);
        return NextResponse.json({success: false, error:e.message}, {status: 500});
    }

}

export async function POST(req:Request){

    const {rawData} = await req.json();

    try {
        // at first we need to add ticker data to dataStore if not added
        const dataStore = await getDataStore();

        const data = await dataStore.findOne({ticker: rawData.ticker,country:rawData.country});

        // if already in dataStore we just update the price
        if(data){
            await dataStore.findOneAndUpdate(
                {ticker: rawData.ticker,
                country: rawData.country,},
                {
                    $set: {
                        lastUnitPrice: Number(rawData.lastUnitPrice),
                        updatedAt: new Date(),
                    }
                }
            )
            return NextResponse.json({success: true, message:"successfully updated ticker prices"}, {status: 200});
        //     if not we need to insert this and check if we can add ticker to websocket
        }else{
            // saving ticker data in dataStore
            await dataStore.insertOne(
                {
                    ticker: rawData.ticker,
                    type: rawData.type,
                    name: rawData.name,
                    lastUnitPrice: Number(rawData.lastUnitPrice),
                    currency: rawData.currency,
                    country: rawData.country,
                    dailyChange: rawData.dailyChange,
                    dailyChangePercent: rawData.dailyChangePercent,
                    websocket:false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            )

            // I AM NOT USING WEBSOCKETS RN

            // we can add ticker to websocket if we have less than 50 tickers already added
            // const count = await dataStore.countDocuments();
            // if(count < 50){
            //     we can add this ticker to websocket
            //     subscribeTicker(rawData.ticker);
            //
            //     await dataStore.findOneAndUpdate(
            //         {ticker:rawData.ticker},
            //         {
            //             $set:{websocket:true}
            //         }
            //     )
            // }
        //     if we already have 50 tickers subscribed in websocket we just send the data and save it
            return NextResponse.json({success: true,message:"successfully added ticker to dataStore"}, {status: 200});
        }

    }catch(e:any){
        return NextResponse.json({success: false, error:e.message}, {status: 500});
    }

}

export async function PUT(req:Request){

    const {ticker, country, lastUnitPrice, dailyChange, dailyChangePercent} = await req.json();

    try{
        const dataStore = await getDataStore();

        await dataStore.findOneAndUpdate(
            {ticker: ticker,
            country:country},
            {
                $set: {
                    lastUnitPrice: lastUnitPrice,
                    dailyChange: dailyChange,
                    dailyChangePercent: dailyChangePercent,
                    updatedAt: new Date(),
                }
            }
        )

        return NextResponse.json({success:true},{status:200});
    }catch(e:any){
        return NextResponse.json({success: false, error:e.message}, {status: 500});
    }
}