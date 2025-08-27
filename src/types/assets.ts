
export type Asset = {
    _id: string;
    userId:string;
    type:string;
    ticker?:string;
    name: string;
    quantity: number;
    purchaseUnitPrice:number;
    lastUnitPrice:number;
    totalValue?:number;
    currency:string;
    dailyChange?:number;
    dailyChangePercent?:number;
    profit_loss?:number;
    profit_lossPercent?:number;

    portfolioPercentage?: number;

    purchaseTotalPrice:number

    country:string;

    addedManually:boolean;
    createdAt:Date | string;
    updatedAt:Date;
};

export type SortKey = keyof Asset | null;

export type SortConfig = {
    key:SortKey;
    direction: "asc" | "desc";
}