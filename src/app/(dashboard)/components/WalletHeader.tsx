import { FaPlus } from "react-icons/fa";
import AddAssetButton from "../components/addAssetButton";

export default function WalletHeader(){

    return(
        <header className={"w-full bg-white h-[100px] rounded-2xl shadow-sm "}>
            <div className={"w-full h-full flex items-center justify-between px-10"}>
                <p className={"text-4xl"}>Total value: 200</p>
                <AddAssetButton/>
            </div>
        </header>
    );
}