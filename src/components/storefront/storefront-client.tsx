"use client";

import { useState } from "react";
import { Category, Product, Restaurant, ProductVariation, ProductVariationOption } from "@/types";
import { useRestaurant } from "@/components/restaurant-provider";
import StorefrontHeader from "./storefront-header";
import ProductCard from "./product-card";
import CartDrawer from "./cart-drawer";
import ProductVariationModal from "./product-variation-modal";
import { Search, LayoutGrid, Clock } from "lucide-react";

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

import { isRestaurantOpen, getNextOpeningTime } from "@/lib/restaurant-utils";

export default function StorefrontClient({
    // Keep props signature for backwards compatibility but we will ignore them
    // and use the single source of truth from Context instead.
    categories: _initialCategories,
    products: _initialProducts,
}: {
    categories?: Category[];
    products?: Product[];
}) {
    const { restaurantData: restaurant } = useRestaurant();
    const categories = restaurant.categories;
    const products = restaurant.products;

    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || "");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const isOpen = isRestaurantOpen(restaurant);

    const handleAddToCart = (item: CartItem) => {
        if (!isOpen) return;
        setCart((prev) => [...prev, item]);
        setSelectedProduct(null);
    };

    const removeFromCart = (cartItemId: string) => {
        setCart((prev) => prev.filter((i) => i.id !== cartItemId));
    };

    const selectProductToOrder = (product: Product) => {
        if (!isOpen) return;
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
        <div className="min-h-screen bg-gray-50/80 pb-28 sm:pb-20 relative">
            {!isOpen && (
                <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-[2px] flex items-center justify-center p-6 sm:p-12">
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 max-w-md w-full text-center space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Clock className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-gray-900 leading-tight">Şu An Hizmet Vermiyoruz</h2>
                            <p className="text-gray-500 font-medium">
                                Restoranımız şu anda kapalıdır. Lütfen çalışma saatleri içerisinde tekrar deneyin.
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <span className="text-sm font-bold text-primary block uppercase tracking-wider mb-1">Açılış Zamanı</span>
                            <span className="text-lg font-black text-gray-900">{getNextOpeningTime(restaurant)}</span>
                        </div>
                        <p className="text-xs text-gray-400 font-medium">Menüyü incelemeye devam edebilirsiniz ancak sipariş veremezsiniz.</p>
                        <button
                            onClick={(e) => {
                                const target = e.currentTarget.parentElement?.parentElement;
                                if (target) target.classList.add('hidden');
                            }}
                            className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition-colors shadow-lg active:scale-[0.98]"
                        >
                            Menüye Göz At
                        </button>
                    </div>
                </div>
            )}

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
            <div className={`max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 transition-opacity duration-500 ${!isOpen ? "opacity-50 pointer-events-none grayscale-[0.5]" : ""}`}>
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
