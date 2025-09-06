import {assetTypes,currencies,countries} from "@/content/assetContent";
import {Filters} from "./walletPageClient";
import { FaChevronDown } from "react-icons/fa";


export default function AssetFilters({ filters, onFilterChange }: { filters: Filters; onFilterChange: (filters: Filters) => void }) {
    const handleChange = (field: keyof Filters, value: string) => {
        onFilterChange({ ...filters, [field]: value });
    };

    return (
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(120px,1fr))] font-medium mb-2 ">
            <section className={"flex items-center relative"}>
                <label htmlFor="type-select" className="sr-only">
                    Choose type of asset
                </label>
                <select id={"type-select"} value={filters.type} onChange={(e) => handleChange("type", e.target.value)}
                        className={`w-full rounded-xl backdrop-blur-md bg-transparent focus:bg-light-bg-secondary dark:focus:bg-dark-bg-tertiary focus:font-medium focus:text-light-text-tertiary dark:focus:text-dark-tertiary text-lg outline-none appearance-none px-1 ${filters.type === "all" ? "text-chart-axis" : "text-light-text-tertiary dark:text-dark-tertiary"}`}>
                    <option className={""} value="all">Type</option>
                    {assetTypes.map(item => (
                        <option key={item.value} value={`${item.value}`}>{item.label}</option>
                    ))}
                </select>
                <FaChevronDown className={`absolute right-0 ml-2 text-light-main dark:text-dark-text-secondary`} size={20} />
            </section>
            <section className={"flex items-center relative"}>
                <label htmlFor="currency-select" className="sr-only">
                    Choose currency
                </label>
                <select id={"currency-select"} value={filters.currency} onChange={(e) => handleChange("currency", e.target.value)}
                        className={`w-full rounded-xl backdrop-blur-md bg-transparent focus:bg-light-bg-secondary dark:focus:bg-dark-bg-tertiary focus:font-medium focus:text-light-text-tertiary dark:focus:text-dark-tertiary text-lg outline-none appearance-none px-1 ${filters.currency === "all" ? "text-chart-axis" : "text-light-text-tertiary dark:text-dark-tertiary"}`}>
                    <option value="all">Currency</option>
                    {currencies.map(item => (
                        <option key={item.value} value={`${item.value}`}>{item.label}</option>
                    ))}
                </select>
                <FaChevronDown className={`absolute right-0 ml-2 text-light-main dark:text-dark-text-secondary`} size={20} />
            </section>
            <section className={"flex items-center relative"}>
                <label htmlFor="country-select" className="sr-only">
                    Choose country
                </label>
                <select id={"country-select"} value={filters.country} onChange={(e) => handleChange("country", e.target.value)}
                        className={`w-full rounded-xl backdrop-blur-md bg-transparent focus:bg-light-bg-secondary dark:focus:bg-dark-bg-tertiary focus:font-medium focus:text-light-text-tertiary dark:focus:text-dark-tertiary text-lg outline-none appearance-none px-1 ${filters.country === "all" ? "text-chart-axis" : "text-light-text-tertiary dark:text-dark-tertiary"}`}>
                    <option value="all">Country</option>
                    {countries.map((item, index) => (
                        <option key={index} value={`${item.name}`}>{item.name}</option>
                    ))}
                </select>
                <FaChevronDown className={`absolute right-0 ml-2 text-light-main dark:text-dark-text-secondary`} size={20} />
            </section>
            <section className={"flex items-center relative"}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={filters.search}
                    onChange={(e) => handleChange("search", e.target.value)}
                    className={`w-full rounded-xl backdrop-blur-md bg-transparent focus:bg-light-bg-secondary dark:focus:bg-dark-bg-tertiary focus:font-medium focus:text-light-text-tertiary dark:focus:text-dark-tertiary text-lg outline-none appearance-none px-1 ${filters.type === "all" ? "text-chart-axis" : "text-light-text-tertiary dark:text-dark-tertiary"}`}
                />
            </section>
        </div>
    );
}