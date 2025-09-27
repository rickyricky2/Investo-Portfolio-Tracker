
export type SubscriptionPlan = {
    name: string;
    monthlyPrice: number;
    yearlyPrice: number;
    available: boolean;
    includes: string[];
}

export const subscriptionPlans: SubscriptionPlan[] = [
    {
        name: "Free",
        monthlyPrice: 0.00,
        yearlyPrice: 0 ,
        available:true,
        includes: [
            "Add all your assets",
            "Trace your investments",
            "Watch your money growth"
        ]
    },
    {
        name: "Standard",
        monthlyPrice: 4.99,
        yearlyPrice: 30 * 12,
        available:false,
        includes: [
            "Not available yet"
        ]
    }
]