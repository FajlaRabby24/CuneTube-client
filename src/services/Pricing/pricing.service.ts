import { httpClient } from "@/lib/axios/httpClient";

export interface IPricingPlan {
  id: string;
  name: string;
  plan: "FREE" | "MONTHLY" | "YEARLY";
  price: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  stripePriceId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const getAllPricingPlans = async () => {
  try {
    const res = await httpClient.get<IPricingPlan[]>("/pricing");
    return res.data;
  } catch (error) {
    console.error("Error fetching pricing plans:", error);
    return [];
  }
};
