import type {Metadata} from "next";
import Wallet from "../../components/wallet";
import WalletHeader from "../../components/WalletHeader";

export const metadata: Metadata = {
    title: "Wallet | Investo",
    description: "User wallet",
};
export default function walletPage(){

    return(
        <div className={"flex flex-col gap-5"}>
            <WalletHeader/>
            <Wallet/>
        </div>
    );
}