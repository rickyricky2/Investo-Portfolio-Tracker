import WebSocket from "ws";
import clientPromise from "@/lib/db";

let ws: WebSocket | null = null;

interface FinnhubTrade {
    p: number;      // cena
    s: string;      // ticker
    t: number;      // timestamp
    v: number;      // volume
}

interface FinnhubMessage {
    type: string;
    data?: FinnhubTrade[];
}

async function getDataStore() {
    const client = await clientPromise;
    const db = client.db("investodb");
    return db.collection("dataStore");
}

export function connectWS(): WebSocket {
    if(ws){ return ws}
    ws = new WebSocket(`wss://ws.finnhub.io?token=${process.env.FINNHUB_API_KEY}`);

    ws.on("open", () => {
        console.log("Successfully connected to Finnhub WS");
    });

    let lastUpdate: Record<string,number> = {};

    ws.on("message", async (msg: WebSocket.Data) => {
        try {
            const tickerData: FinnhubMessage = JSON.parse(msg.toString());
            const dataStore = await getDataStore();

            if(tickerData.data) {
                for(const item of tickerData.data) {
                    const now = Date.now();
                    const last = lastUpdate[item.s] || 0;

                    if(now - last > 1000 * 60 * 40){
                        await dataStore.findOneAndUpdate(
                            {ticker: item.s},
                            {
                                $set: {
                                    lastUnitPrice: item.p,
                                    updatedAt:now,
                                }
                            });
                        lastUpdate[item.s] = now;
                    }
                }
            }
        } catch (err) {
            console.error("Some eternal error occurred:", err);
        }
    });

    ws.on("close", () => {
        console.log("WS closed — reconnecting...");
        // restart if needed
        setTimeout(connectWS, 5000);
    });

    ws.on("error", (err) => {
        console.error("WS Error:", err);
        ws?.close();
    });

    return ws;
}

export function subscribeTicker(symbol: string): void {
    if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "subscribe", symbol }));
    } else {
        console.warn("WS is not connected:", symbol);
    }
}

export function unsubscribeTicker(symbol: string): void {
    if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "unsubscribe", symbol }));
    } else {
        console.warn("WS is not connected:", symbol);
    }
}
