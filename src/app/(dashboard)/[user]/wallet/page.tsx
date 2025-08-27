import type {Metadata} from "next";
import WalletPageClient from "../../components/walletPageClient";

export const metadata: Metadata = {
    title: "Wallet | Investo",
    description: "User wallet",
};
export default function WalletPage(){
    return(
        <WalletPageClient />
    );
}