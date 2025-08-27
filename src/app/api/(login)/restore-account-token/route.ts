
import {NextResponse} from "next/server";
import jwt from 'jsonwebtoken';
export async function POST(req:Request){
    const {token} = await req.json();

    try{
        jwt.verify(token, process.env.PASSWORD_RESET_SECRET!);
        return NextResponse.json({success:true},{status:200});
    }catch(error:unknown){
        return NextResponse.json({success:false,error:error},{status:500});
    }

}