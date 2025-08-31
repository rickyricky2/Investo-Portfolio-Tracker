import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import jwt from 'jsonwebtoken';
import clientPromise from "@/lib/db";
import {ObjectId} from "mongodb";

const client = await clientPromise;
const db = client.db("investodb");

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
        const {rawData, notAddDataManually} = json;
        const userData = {
            type: String(rawData.type),
            ticker:String(rawData.ticker),
            name: String(rawData.name),
            quantity: String(rawData.quantity),
            purchaseUnitPrice: Number(rawData.purchaseUnitPrice),
            lastUnitPrice: Number(rawData.lastUnitPrice),
            currency: String(rawData.currency),
            country: String(rawData.country),
            addedManually: !notAddDataManually,
            dailyChange: Number(rawData.dailyChange) || 0,
            dailyChangePercent: Number(rawData.dailyChangePercent) || 0,
        }

        const email = await getUserEmail();

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
            ticker:userData.ticker,
            name: userData.name,
            quantity: userData.quantity,
            purchaseUnitPrice: userData.purchaseUnitPrice,
            lastUnitPrice: userData.lastUnitPrice,
            currency: userData.currency,
            country: userData.country,
            addedManually:userData.addedManually,
            dailyChange: userData.dailyChange,
            dailyChangePercent: userData.dailyChangePercent,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return NextResponse.json({success:true},{status:200});

    } catch(error:unknown){
        return NextResponse.json({success:false, error:error},{status:500});
    }
}

export async function GET() {
    try{
        const email = await getUserEmail();

        const users = db.collection('users');

        const user = await users.findOne( {email:email});

        if(!user){
            return NextResponse.json({success:false,error:"Can't find user"},{status:400});
        }

        const userId = new ObjectId(user._id);

        const assets = db.collection('assets');

        const userAssets = await assets.find({userId: userId}).toArray();

        return NextResponse.json({success:true,assets:userAssets},{status:200});

    }catch(error:unknown){
        return NextResponse.json({success:false, error:error},{status:500});
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const {editedValues} = body;

        const email = await getUserEmail();

        const users = db.collection('users');

        const user = await users.findOne({ email:email });
        if (!user) {
            return NextResponse.json({ success: false, error: "Can't find user" }, { status: 400 });
        }
        const assetId = new ObjectId(editedValues._id);
        const userId = new ObjectId(user._id);

        const assets = db.collection('assets');
        const asset = await assets.findOne({ _id: assetId, userId:userId });

        if (!asset) {
            return NextResponse.json({ success: false, error: "Can't find asset or no permission" }, { status: 404 });
        }

        await assets.findOneAndUpdate(
            { _id: assetId, userId: userId },
            {
                $set: {
                    ticker:editedValues.ticker,
                    type: editedValues.type,
                    name: editedValues.name,
                    quantity: Number(editedValues.quantity),
                    purchaseUnitPrice: Number(editedValues.purchaseUnitPrice),
                    lastUnitPrice: Number(editedValues.lastUnitPrice),
                    currency: editedValues.currency,
                    country:editedValues.country,
                    updatedAt: new Date(),
                }
            });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch{
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
    } catch (error: unknown) {
        console.error(error);
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}