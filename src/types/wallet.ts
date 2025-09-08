import {SortKey,Asset} from "@/types/assets";

export type walletProps = {
    tableHeaders: {
        label:string;
        key:SortKey;
    }[];
    sortedFilteredAssets: Asset[];
    handleSort: (key:SortKey) => void ;
    getAssets: () => Promise<void>;
    isLoading:boolean;
    error:string;
}