'use client';

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function ScrollReveal({ children }: { children: React.ReactNode }) {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
            {children}
        </div>
    );
}