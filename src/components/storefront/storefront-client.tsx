"use client";

import { useState } from "react";
import { Category, Product, Restaurant, ProductVariation, ProductVariationOption } from "@/types";
import { useRestaurant } from "@/components/restaurant-provider";
import StorefrontHeader from "./storefront-header";
import ProductCard from "./product-card";
import CartDrawer from "./cart-drawer";
import ProductVariationModal from "./product-variation-modal";
import { Search, LayoutGrid } from "lucide-react";

export type CartItem = {
    id: string;
    product: Product;
    quantity: number;
    selectedOptions: {
        variationId: string;
        optionId: string;
        variationName: string;
        optionName: string;
        priceDelta: number;
    }[];
    totalPrice: number;
};

export default function StorefrontClient({
    categories,
    products,
}: {
    categories: Category[];
    products: Product[];
}) {
    const { restaurantData: restaurant } = useRestaurant();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || "");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const handleAddToCart = (item: CartItem) => {
        setCart((prev) => [...prev, item]);
        setSelectedProduct(null);
    };

    const removeFromCart = (cartItemId: string) => {
        setCart((prev) => prev.filter((i) => i.id !== cartItemId));
    };

    const selectProductToOrder = (product: Product) => {
        if (product.variations && product.variations.length > 0) {
            setSelectedProduct(product);
        } else {
            handleAddToCart({
                id: Date.now().toString(),
                product,
                quantity: 1,
                selectedOptions: [],
                totalPrice: product.price,
            });
        }
    };

    const filteredProducts = products
        .filter((p) => p.categoryId === selectedCategory)
        .filter((p) =>
            searchQuery.trim() === "" ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.description?.toLowerCase() ?? "").includes(searchQuery.toLowerCase())
        );

    const selectedCategoryName = categories.find((c) => c.id === selectedCategory)?.name;

    return (
        <div className="min-h-screen bg-gray-50/80 pb-28 sm:pb-20">
            <StorefrontHeader restaurant={restaurant} />

            {/* Sticky Category Navigation */}
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
                <div className="max-w-5xl mx-auto">
                    {/* Category tabs */}
                    <div className="flex overflow-x-auto scrollbar-hide px-4 py-3 gap-2">
                        {categories.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => {
                                    setSelectedCategory(c.id);
                                    setSearchQuery("");
                                }}
                                className={`whitespace-nowrap flex-shrink-0 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${selectedCategory === c.id
                                        ? "bg-primary text-white shadow-md shadow-primary/30 scale-105"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                                    }`}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
                {/* Section header with search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <LayoutGrid className="w-5 h-5 text-primary" />
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                            {selectedCategoryName}
                        </h2>
                        <span className="text-sm text-gray-400 font-medium bg-gray-100 px-2.5 py-0.5 rounded-full">
                            {filteredProducts.length}
                        </span>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Ürün ara..."
                            className="pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary w-full sm:w-56 transition-all"
                        />
                    </div>
                </div>

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                        {filteredProducts.map((p) => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                onSelect={() => selectProductToOrder(p)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="text-5xl mb-4">🔍</div>
                        <p className="text-gray-500 font-medium">Ürün bulunamadı</p>
                        <p className="text-gray-400 text-sm mt-1">Farklı bir kategori veya arama terimi deneyin</p>
                    </div>
                )}
            </div>

            <CartDrawer cart={cart} onRemove={removeFromCart} />

            <ProductVariationModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
}
