import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import jwt from 'jsonwebtoken';
import clientPromise from "@/lib/db";
import {ObjectId} from "mongodb";

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

        const userId = new ObjectId(user._id);

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

        const userId = new ObjectId(user._id);

        const assets = db.collection('assets');

        const userAssets = await assets.find({userId: userId}).toArray();

        return NextResponse.json({success:true,assets:userAssets},{status:200});

    }catch(e:any){
        return NextResponse.json({success:false, error:e},{status:500});
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { id, type, name, symbol, quantity, unitPrice, currency} = body;

        const assetId = new ObjectId(id);
        const email = await getUserEmail();

        const client = await clientPromise;
        const db = client.db("investodb");
        const users = db.collection('users');

        const user = await users.findOne({ email:email });
        if (!user) {
            return NextResponse.json({ success: false, error: "Can't find user" }, { status: 400 });
        }
        const userId = new ObjectId(user._id);

        const assets = db.collection('assets');
        const asset = await assets.findOne({ _id: assetId, userId });

        if (!asset) {
            return NextResponse.json({ success: false, error: "Can't find asset or no permission" }, { status: 404 });
        }

        const totalValue = Number(unitPrice) * Number(quantity);

        await assets.findOneAndUpdate(
            { _id: assetId, userId: userId },
            {
                $set: {
                    type: type,
                    name: name,
                    symbol: symbol,
                    quantity: quantity,
                    unitPrice: unitPrice,
                    totalValue: totalValue,
                    currency: currency,
                }
            });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: "Invalid Id" }, { status: 400 });
        }

        const assetId = new ObjectId(id);
        const email = await getUserEmail();

        const client = await clientPromise;
        const db = client.db("investodb");
        const users = db.collection('users');

        const user = await users.findOne({ email:email });
        if (!user) {
            return NextResponse.json({ success: false, error: "Can't find user" }, { status: 400 });
        }
        const userId = new ObjectId(user._id);

        const assets = db.collection('assets');
        const asset = await assets.findOne({ _id: assetId, userId: userId });

        if (!asset) {
            return NextResponse.json({ success: false, error: "Can't find asset or no permission" }, { status: 404 });
        }

        await assets.findOneAndDelete({ _id: assetId, userId });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}