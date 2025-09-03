import type {Metadata} from "next";
import PortfolioDashboard from "../components/PortfolioDashboard";
import "@/app/global.css";

export const metadata: Metadata = {
    title: "Dashboard | Investo",
    description: "User Dashboard",
};
export default function DashboardPage(){

    return(
        <div className={"min-h-screen w-full tracking-tight"}>
            <PortfolioDashboard/>
        </div>
    );
}