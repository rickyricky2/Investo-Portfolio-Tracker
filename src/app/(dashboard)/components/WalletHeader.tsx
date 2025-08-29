import AddAssetButton from "../components/addAssetButton";
import AssetFilters from "./AssetFilters";
import {Filters} from "./walletPageClient";

export default function WalletHeader({filters,onFilterChange}: {filters:Filters; onFilterChange: (filters: Filters) => void;}) {

    return(
        <header className={"w-full flex items-center bg-light-bg-secondary dark:bg-dark-bg-tertiary min-h-[80px] lg:min-h-[100px] rounded-4xl shadow-sm "}>
            <div className={"w-full h-full flex items-center justify-between p-5 gap-5"}>
                <div className={"w-full"}>
                    <AssetFilters filters={filters} onFilterChange={onFilterChange}/>
                </div>
                <div className={"hidden lg:block"}>
                    <AddAssetButton mobile={false} />
                </div>
            </div>
        </header>
    );
}