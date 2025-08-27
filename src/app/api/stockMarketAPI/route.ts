import {NextResponse} from "next/server";

const finnhub_token = process.env.FINNHUB_API_KEY;
const twelvedata_token = process.env.TWELVEDATA_API_KEY;

export async function GET(req:Request){

    const {searchParams} = new URL(req.url);
    const dataType = searchParams.get("dataType") || "";
    const ticker = searchParams.get("ticker");
    const country = searchParams.get("country");
    const amount = searchParams.get("amount");
    const base = searchParams.get("base");
    const main_currency = searchParams.get("main_currency");


    if(dataType === "prices"){
        let pricesUrl = `https://finnhub.io/api/v1/quote?country=${country}&symbol=${ticker}&token=${finnhub_token}`;
        let res = await fetch(pricesUrl);

        if (res.ok) {
            const data = await res.json();
            const price = data.c;

            if(price && price > 0){
                return NextResponse.json({success:true, price},{status:200});
            }
        }

        pricesUrl = `https://api.twelvedata.com/price?symbol=${ticker}&apikey=${twelvedata_token}&country=${country}`;
        res = await fetch(pricesUrl);

        if(res.ok){
            const data = await res.json();

            let price;
            if(data.price){
                price = data.price;
                return NextResponse.json({success:true, price},{status:200});
            }

        }

        return NextResponse.json({success:false, error:"We couldn't fetch prices"},{status:500});
    }
    else if(dataType === "tickerInfo"){
        let tickerInfoUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${finnhub_token}&country=${country}`;
        let res = await fetch(tickerInfoUrl);

        if (res.ok) {
            const data = await res.json();
            if(Object.keys(data).length !== 0){
                return NextResponse.json({success:true, tickerInfo: data},{status:200});
            }
        }

        tickerInfoUrl = `https://api.twelvedata.com/quote?symbol=${ticker}&apikey=${twelvedata_token}&country=${country}`;
        res = await fetch(tickerInfoUrl);

        if(res.ok){
            const data = await res.json();

            return NextResponse.json({success:true, tickerInfo: data},{status:200});
        }

        return NextResponse.json({success:false, error:"We couldn't fetch ticker info"},{status:500});
    }else{

        const tickerInfoUrl = `https://api.twelvedata.com/quote?symbol=${ticker}&apikey=${twelvedata_token}&country=${country}`;
        const res = await fetch(tickerInfoUrl);

        if(res.ok){
            const data = await res.json();
            if(data.status !== "error"){
                return NextResponse.json({success:true, tickerInfo: data},{status:200});
            }
        }
        return NextResponse.json({success:false, error:"We couldn't fetch ticker info"},{status:500});
    }
}