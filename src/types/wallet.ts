import {SortKey,Asset,SortConfig} from "@/types/assets";


export type walletProps = {
    tableHeaders: {
        label:string;
        key:SortKey;
    }[];
    sortedFilteredAssets: Asset[];
    handleSort: (key:SortKey) => void ;
    sortConfig: SortConfig;
    getAssets: () => Promise<void>;
    isLoading:boolean;
    getPortfolioPercentage: (assetValue:number) => string | 0;
    error:string;
}