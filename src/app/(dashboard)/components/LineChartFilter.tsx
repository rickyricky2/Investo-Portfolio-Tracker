
export default function LineChartFilter({firstDate,filter,onFilterChange}: {firstDate:string; filter:string; onFilterChange: (filters:string) => void;}){
    const firstYear = Number(firstDate.split("-")[0] || new Date().toISOString().split("-")[0] );
    const currentYear = new Date().getFullYear();

    const years:number[] = [];
    for(let year = firstYear; year <= currentYear; year++) {
        years.push(year);
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange(e.target.value);
    }

    return(
        <select
            onChange={handleChange}
            className={` rounded-xl backdrop-blur-md bg-transparent focus:bg-light-bg-secondary dark:focus:bg-dark-bg-tertiary focus:font-medium focus:text-light-text-tertiary dark:focus:text-dark-tertiary text-2xl outline-none appearance-none ${filter === "all" ? "text-chart-axis" : "text-light-text-tertiary dark:text-dark-tertiary"}`}
            >
            <option value={"all"}>All Years</option>
            {years.map(year => <option key={year} value={year}>{year}</option>)}
        </select>
    );
}