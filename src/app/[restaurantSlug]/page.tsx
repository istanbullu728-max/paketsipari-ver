import { mockCategories, mockProducts, mockRestaurant } from "@/lib/mock-data";
import StorefrontClient from "@/components/storefront/storefront-client";

export default async function RestaurantStorefrontPage({
    params,
}: {
    params: Promise<{ restaurantSlug: string }>;
}) {
    const { restaurantSlug } = await params;
    // In a real app we fetch by slug from DB
    const restaurant = mockRestaurant;
    const categories = mockCategories;
    const products = mockProducts;

    return (
        <StorefrontClient
            categories={categories}
            products={products}
        />
    );
}
