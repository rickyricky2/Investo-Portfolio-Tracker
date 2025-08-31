import {NextResponse} from "next/server";

const twelvedata_token = process.env.TWELVEDATA_API_KEY;

export async function GET(req:Request){

    const {searchParams} = new URL(req.url);
    const ticker = searchParams.get("ticker");
    const country = encodeURIComponent(searchParams.get("country") || "");

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