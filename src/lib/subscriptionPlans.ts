
export type SubscriptionPlan = {
    name: string;
    monthlyPrice: number;
    yearlyPrice: number;
    includes: string[];
}

export const subscriptionPlans: SubscriptionPlan[] = [
    {
        name: "Free",
        monthlyPrice: 0.00,
        yearlyPrice: 0 ,
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
        includes: [
            "Add all your assets",
            "Trace your investments",
            "Watch your money growth",
            "And more"
        ]
    }
]