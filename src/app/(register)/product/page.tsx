import ProductClient from "@/components/ProductClient";
import PublicHeader from "@/components/publicHeader";

export default function ProductPage() {
    return (
        <div className="w-full min-h-screen text-light-text dark:text-dark-text-secondary tracking-wider overflow-hidden">
            <PublicHeader/>
            <ProductClient />
        </div>
    );
}