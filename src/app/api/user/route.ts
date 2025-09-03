import {NextResponse} from "next/server";
import {getCollection} from "@/lib/db";
import {ObjectId} from "mongodb";

export async function GET(req:Request){
    try {
        const {searchParams} = new URL(req.url);
        const userId = searchParams.get("id");
        if(!userId){
            return NextResponse.json({success: false, error:"no user id found"}, {status: 400});
        }
        const users = await getCollection("users");
        const id = new ObjectId(userId);

        const userData = await users.findOne({_id: id});

        return NextResponse.json({success: true, userData}, {status: 200});
    }catch(error:unknown){
        console.error(error);
        return NextResponse.json({success: false, error:"Internal Server Error"}, {status: 500});
    }
}

export async function PUT(req:Request){
    try {
        const {userId,email,password,userName}= await req.json();
        const users = await getCollection("users");

        const id = new ObjectId(userId);

        if(email !== undefined){
            await users.findOneAndUpdate(
                {_id: id},
                {$set: {email: email}});
        }else if(password !== undefined){
            await users.findOneAndUpdate(
                {_id: id},
                {$set: {password: password}});
        }else if(userName !== undefined){
            const parts = userName.trim().split(" ").filter(Boolean);
            await users.findOneAndUpdate(
                {_id: id},
                {$set: {
                    firstName: parts[0],
                    lastName: parts[1] || "",
                }});
        }

        return NextResponse.json({success: true}, {status: 200});
    }catch(error:unknown){
        console.error(error);
        return NextResponse.json({success: false, error:"Internal Server Error"}, {status: 500});
    }
}