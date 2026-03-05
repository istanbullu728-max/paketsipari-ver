import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { mockRestaurant } from "@/lib/mock-data";

export default async function RestaurantLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ restaurantSlug: string }>;
}) {
    const { restaurantSlug } = await params;

    // Mock fetching logic
    if (restaurantSlug !== mockRestaurant.slug) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Shared Storefront Header could go here */}
            <main className="flex-grow">{children}</main>
        </div>
    );
}
