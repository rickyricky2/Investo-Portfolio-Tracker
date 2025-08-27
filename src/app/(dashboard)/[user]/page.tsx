import type {Metadata} from "next";
import PortfolioDashboard from "../components/PortfolioDashboard";
import "@/app/global.css";

export const metadata: Metadata = {
    title: "Dashboard | Investo",
    description: "User Dashboard",
};
export default function DashboardPage(){

    return(
        <div className={"container min-h-screen max-w-[100%] bg-light-bg dark:bg-dark-bg tracking-tight"}>
            <PortfolioDashboard/>
        </div>
    );
}