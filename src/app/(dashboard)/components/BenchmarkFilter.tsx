import {indexFilter} from "@/app/(dashboard)/components/BenchmarkChart";
import { IoIosCheckmark } from "react-icons/io";

export default function BenchmarkFilter({filters, onFilterChange}:{filters:indexFilter;onFilterChange: (filter:indexFilter) => void;}){

    const handleToggle = (index: keyof indexFilter) => {
        onFilterChange({...filters, [index]:{ ...filters[index], active:!filters[index].active} });
        const saved = localStorage.getItem("index_list");
        let indexList:string[] = saved ? JSON.parse(saved) : [];
        if(indexList.includes(index)){
            indexList = indexList.filter( (i:string) => i !== index );
        }else{
            indexList.push(index);
        }
        localStorage.setItem("index_list",JSON.stringify(indexList));
    }

    return(
        <section className={"flex text-xl text-dark-text-tertiary dark:text-dark-text-secondary"}>
                {(Object.keys(filters) as (keyof indexFilter)[]).map( (index: keyof indexFilter) => {
                    return(
                        <div key={index} className={"flex items-center gap-1 pr-2 md:px-2"}>
                            <div onClick={() => handleToggle(index)}
                                 className={"w-[15px] h-[15px] border-[0.6mm] border-dark-text-tertiary dark:border-dark-text-secondary rounded-sm flex justify-center items-center"}
                            >
                                {filters[index].active
                                    ? (
                                        <div className={"flex justify-center items-center relative"}>
                                            <IoIosCheckmark size={25}/>
                                        </div>
                                    )
                                    : null}
                            </div>
                            <span>{index.toUpperCase()}</span>
                        </div>
                    );
                })}
        </section>
    );
}