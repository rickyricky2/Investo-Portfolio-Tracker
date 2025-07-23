import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import jwt from 'jsonwebtoken';
import clientPromise from "@/lib/db";

const getUserEmail = async ()=>{
    const cookieStore = await cookies();
    const token = cookieStore.get("login_token")?.value;

    if(!token){
        throw new Error("Unauthorized");
    }
    const decoded = jwt.verify(token,process.env.LOGIN_SECRET!) as {email:string};

    return decoded.email;
}
export async function POST(req:Request){
    try{
        const json = await req.json();
        const rawData = json.rawData;
        const userData = {
            type: String(rawData.type),
            name: String(rawData.name),
            symbol: String(rawData.symbol),
            quantity: String(rawData.quantity),
            unitPrice: String(rawData.unitPrice),
            currency: String(rawData.currency),
        }
        const totalValue = Number(userData.unitPrice) * Number(userData.quantity);

        const email = await getUserEmail();

        const client = await clientPromise;
        const db = client.db("investodb");
        const users = db.collection('users');

        const user = await users.findOne( {email:email});

        if(!user){
            return NextResponse.json({success:false,error:`Can't find user`},{status:400});
        }

        const userId = user._id;

        const assets = db.collection('assets');

        await assets.insertOne({
            userId: userId,
            type: userData.type,
            name: userData.name,
            symbol: userData.symbol,
            quantity: userData.quantity,
            unitPrice: userData.unitPrice,
            totalValue: totalValue,
            currency: userData.currency,
            createdAt: new Date(),
        });

        return NextResponse.json({success:true},{status:200});

    } catch(error:any){
        return NextResponse.json({success:false, error:error},{status:500});
    }
}

export async function GET() {
    try{
        const email = await getUserEmail();

        const client = await clientPromise;
        const db = client.db("investodb");
        const users = db.collection('users');

        const user = await users.findOne( {email:email});

        if(!user){
            return NextResponse.json({success:false,error:"Can't find user"},{status:400});
        }

        const userId = user._id;

        const assets = db.collection('assets');

        const userAssets = await assets.find({userId: userId}).toArray();

        console.log(userAssets);
        return NextResponse.json({success:true,assets:userAssets},{status:200});

    }catch(e:any){
        return NextResponse.json({success:false, error:e},{status:500});
    }
}