import ProductClient from "@/components/ProductClient";
import PublicHeader from "@/components/publicHeader";

export default function ProductPage() {
    return (
        <div className="w-full min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text tracking-wider overflow-hidden">
            <PublicHeader/>
            <ProductClient />
        </div>
    );
}