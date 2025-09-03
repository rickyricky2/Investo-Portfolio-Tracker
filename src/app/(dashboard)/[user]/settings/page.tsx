import SettingsClient from "../../components/settingsClient";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Settings | Investo",
    description: "User Settings",
};

export default function Settings(){
    return(
        <div className={"min-h-screen w-full tracking-tight"}>
            <SettingsClient/>
        </div>
    );
}