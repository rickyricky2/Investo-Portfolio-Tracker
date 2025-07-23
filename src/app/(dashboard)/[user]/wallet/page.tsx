import type {Metadata} from "next";
import WalletAssets from "../../components/wallet";
import WalletHeader from "../../components/WalletHeader";

export const metadata: Metadata = {
    title: "Wallet | Investo",
    description: "User wallet",
};
export default function WalletPage(){

    return(
        <div className={"flex flex-col gap-5"}>
            <WalletHeader/>
            <WalletAssets/>
        </div>
    );
}