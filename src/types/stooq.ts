export type latestRecord = {
    Symbol:string;
    Date:string;
    Time:string;
    Open:string;
    High:string;
    Low:string;
    Close:string;
    Volume:string;
}

export type historicalRecord = {
    Date:string;
    Open:string;
    High:string;
    Low:string;
    Close:string;
    Volume:string;
};

export interface HistoricalPrice {
    date: string;
    close: number;
}