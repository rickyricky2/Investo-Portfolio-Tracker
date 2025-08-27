
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export default async function getUserFromToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("login_token")?.value;

    if(!token) return false;

    try{
        return jwt.verify(token, process.env.LOGIN_SECRET!);
    }catch{
        cookieStore.delete("login_token");
        return false;
        }
}