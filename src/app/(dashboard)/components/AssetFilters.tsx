interface Filters {
    type: string;
    currency: string;
    search: string;
}

export default function AssetFilters({ filters, onFilterChange }: { filters: Filters; onFilterChange: (filters: Filters) => void }) {
    const handleChange = (field: keyof Filters, value: string) => {
        onFilterChange({ ...filters, [field]: value });
    };

    return (
        <div className="flex gap-4 font-medium">
            <select value={filters.type} onChange={(e) => handleChange("type", e.target.value)} className=" focus:bg-gray-200 focus:outline-none w-full border-white border-1 border-b-2 p-1 border-b-black  focus:border-white  focus:ring-0 focus:border-b-black bg-transparent apperance-none pr-6 text-lg">
                <option value="all">Type</option>
                <option value="stock">Stock</option>
                <option value="bond">Bond</option>
                <option value="mutual_fund">Mutual Fund</option>
                <option value="etf">ETF (Exchange-Traded Fund)</option>
                <option value="real_estate">Real Estate</option>
                <option value="crypto">Cryptocurrency</option>
                <option value="commodity">Commodity</option>
                <option value="cash">Cash</option>
                <option value="private_equity">Private Equity</option>
                <option value="hedge_fund">Hedge Fund</option>
                <option value="collectibles">Collectibles (Art, Antiques)</option>
                <option value="forex">Forex (Foreign Exchange)</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="venture_capital">Venture Capital</option>
                <option value="precious_metals">Precious Metals (Gold, Silver)</option>
                <option value="insurance_contracts">Insurance Contracts</option>
                <option value="structured_products">Structured Products</option>
                <option value="debt_instruments">Debt Instruments</option>
                <option value="royalties">Royalties</option>
                <option value="other">Other</option>
            </select>

            <select value={filters.currency}  onChange={(e) => handleChange("currency", e.target.value)} className="focus:outline-none focus:bg-gray-200 w-full border-white border-1 border-b-2 p-1 border-b-black  focus:border-white  focus:ring-0 focus:border-b-black bg-transparent apperance-none pr-6 text-lg">
                <option value="all">Currency</option>
                <option value="USD">USD – US Dollar</option>
                <option value="EUR">EUR – Euro</option>
                <option value="GBP">GBP – British Pound</option>
                <option value="CHF">CHF – Swiss Franc</option>
                <option value="JPY">JPY – Japanese Yen</option>
                <option value="PLN">PLN – Polish Zloty</option>
                <option value="CAD">CAD – Canadian Dollar</option>
                <option value="AUD">AUD – Australian Dollar</option>
                <option value="CNY">CNY – Chinese Yuan</option>
                <option value="NZD">NZD – New Zealand Dollar</option>
                <option value="SEK">SEK – Swedish Krona</option>
                <option value="NOK">NOK – Norwegian Krone</option>
                <option value="MXN">MXN – Mexican Peso</option>
                <option value="SGD">SGD – Singapore Dollar</option>
                <option value="HKD">HKD – Hong Kong Dollar</option>
                <option value="KRW">KRW – South Korean Won</option>
            </select>

            <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => handleChange("search", e.target.value)}
                className="w-full border-white border-1 border-b-2 p-1 border-b-black focus:outline-none focus:bg-gray-200  focus:border-white  focus:ring-0 focus:border-b-black bg-transparent apperance-none pr-6 text-lg"
            />
        </div>
    );
}