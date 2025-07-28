import { FaPlus } from "react-icons/fa";
import AddAssetButton from "../components/addAssetButton";
import AssetFilters from "./AssetFilters";

interface Filters {
    type: string;
    currency: string;
    search: string;
}

export default function WalletHeader({filters,onFilterChange, onAdded}: {filters:Filters; onFilterChange: (filters: Filters) => void; onAdded: () => void}) {

    return(
        <header className={"w-full bg-light-bg-secondary dark:bg-dark-bg h-[100px] rounded-2xl shadow-sm "}>
            <div className={"w-full h-full flex items-center justify-between px-10"}>
                <div>
                    <AssetFilters filters={filters} onFilterChange={onFilterChange}/>
                </div>
                <AddAssetButton onAdded={onAdded}/>
            </div>
        </header>
    );
}