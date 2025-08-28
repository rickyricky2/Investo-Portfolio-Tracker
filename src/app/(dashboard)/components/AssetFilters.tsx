import {assetTypes,currencies,countries} from "@/content/assetContent";
import {Filters} from "./walletPageClient";


export default function AssetFilters({ filters, onFilterChange }: { filters: Filters; onFilterChange: (filters: Filters) => void }) {
    const handleChange = (field: keyof Filters, value: string) => {
        onFilterChange({ ...filters, [field]: value });
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 font-medium mb-2 max-sm:w-[150px]">
            <select value={filters.type} onChange={(e) => handleChange("type", e.target.value)} className=" focus:bg-light-bg focus:outline-none w-full border-light-text-secondary border-1 border-b-2 p-1 border-b-light-main dark:border-dark-bg-secondary dark:border-b-dark-main text-dark-text-secondary focus:text-light-text dark:text-dark-text-secondary dark:focus:text-dark-text dark:focus:bg-dark-bg dark:focus:border-dark-bg  focus:border-light-bg  focus:ring-0 focus:border-b-light-main dark:focus:border-b-dark-main bg-transparent apperance-none pr-6 text-lg">
                <option value="all">Type</option>
                {assetTypes.map( item => (
                    <option key={item.value} value={`${item.value}`}>{item.label}</option>
                ))}
            </select>

            <select value={filters.currency}  onChange={(e) => handleChange("currency", e.target.value)} className="focus:bg-light-bg focus:outline-none w-full border-light-text-secondary border-1 border-b-2 p-1 border-b-light-main dark:border-dark-bg-secondary dark:border-b-dark-main text-dark-text-secondary focus:text-light-text dark:text-dark-text-secondary dark:focus:text-dark-text dark:focus:bg-dark-bg dark:focus:border-dark-bg  focus:border-light-bg  focus:ring-0 focus:border-b-light-main dark:focus:border-b-dark-main bg-transparent apperance-none pr-6 text-lg">
                <option value="all">Currency</option>
                {currencies.map( item => (
                    <option key={item.value} value={`${item.value}`}>{item.label}</option>
                ))}
            </select>

            <select value={filters.country}  onChange={(e) => handleChange("country", e.target.value)} className="focus:bg-light-bg focus:outline-none w-full border-light-text-secondary border-1 border-b-2 p-1 border-b-light-main dark:border-dark-bg-secondary dark:border-b-dark-main text-dark-text-secondary focus:text-light-text dark:text-dark-text-secondary dark:focus:text-dark-text dark:focus:bg-dark-bg dark:focus:border-dark-bg  focus:border-light-bg  focus:ring-0 focus:border-b-light-main dark:focus:border-b-dark-main bg-transparent apperance-none pr-6 text-lg">
                <option value="all">Country</option>
                {countries.map((item,index) => (
                    <option key={index} value={`${item.name}`}>{item.name}</option>
                ))}
            </select>

            <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => handleChange("search", e.target.value)}
                className="focus:bg-light-bg focus:outline-none w-full border-light-text-secondary border-1 border-b-2 p-1 border-b-light-main dark:border-dark-bg-secondary dark:border-b-dark-main text-dark-text-secondary focus:text-light-text dark:text-dark-text-secondary dark:focus:text-dark-text dark:focus:bg-dark-bg dark:focus:border-dark-bg  focus:border-light-bg  focus:ring-0 focus:border-b-light-tertiary dark:focus:border-b-dark-main bg-transparent apperance-none pr-6 text-lg"
            />
        </div>
    );
}