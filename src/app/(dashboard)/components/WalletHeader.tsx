import AddAssetButton from "../components/addAssetButton";
import AssetFilters from "./AssetFilters";
import {Filters} from "./walletPageClient";

export default function WalletHeader({filters,onFilterChange}: {filters:Filters; onFilterChange: (filters: Filters) => void;}) {

    return(
        <header className={"w-full bg-light-bg-secondary dark:bg-dark-bg-secondary h-20 lg:h-[100px] rounded-2xl shadow-sm "}>
            <div className={"w-full h-full flex items-center justify-between px-5"}>

                <div>
                    <AssetFilters filters={filters} onFilterChange={onFilterChange}/>
                </div>
                <div className={"hidden lg:block"}>
                    <AddAssetButton nav={false} />
                </div>
            </div>
        </header>
    );
}