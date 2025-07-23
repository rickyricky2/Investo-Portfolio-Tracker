export type Asset = {
    id: string;
    userId:string;
    type: string;
    name: string;
    symbol?: string;
    quantity?: number;
    unitPrice?: number;
    totalValue: number;
    currency: string;
    portfolioPercentage?: number;
    dailyChange?: number;
};

export type SortKey = keyof Asset | null;

export type SortConfig = {
    key:SortKey;
    direction: "asc" | "desc";
}