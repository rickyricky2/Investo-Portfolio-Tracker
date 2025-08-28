import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo URI to .env");
}

declare global {
    var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
}
export async function getCollection(str:string) {
    const client = await clientPromise;
    const db = client.db("investodb");
    return db.collection(str);
}

export default clientPromise;