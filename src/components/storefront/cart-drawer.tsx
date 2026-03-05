"use client";

import { useState } from "react";
import { useRestaurant } from "@/components/restaurant-provider";
import { ShoppingBag, X, Trash2, ChevronRight, Package } from "lucide-react";
import { CartItem } from "./storefront-client";
import CheckoutDialog from "./checkout-dialog";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export default function CartDrawer({
    cart,
    onRemove,
}: {
    cart: CartItem[];
    onRemove: (id: string) => void;
}) {
    const { restaurantData: restaurant } = useRestaurant();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const remaining = Math.max(0, restaurant.minOrderAmount - totalAmount);
    const progressPct = Math.min(100, (totalAmount / restaurant.minOrderAmount) * 100);

    return (
        <Sheet>
            {/* Mobile bottom bar */}
            <SheetTrigger asChild>
                <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
                    <div className="mx-3 mb-3">
                        <button className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl shadow-2xl font-semibold transition-all ${itemCount > 0
                                ? "bg-primary text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${itemCount > 0 ? "bg-white text-primary" : "bg-gray-300 text-gray-500"
                                    }`}>
                                    {itemCount}
                                </div>
                                <span>Sepeti Görüntüle</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold">{totalAmount.toFixed(2)} ₺</span>
                                <ChevronRight className="w-4 h-4 opacity-70" />
                            </div>
                        </button>
                    </div>
                </div>
            </SheetTrigger>

            {/* Desktop floating button */}
            <SheetTrigger asChild>
                <div className="hidden sm:block fixed bottom-8 right-8 z-50">
                    <button className="group relative flex items-center gap-3 bg-primary text-white px-6 h-14 rounded-2xl shadow-2xl shadow-primary/40 hover:bg-primary/95 hover:scale-105 transition-all duration-200 font-semibold">
                        <div className="relative">
                            <ShoppingBag className="w-5 h-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-2.5 -right-2.5 bg-white text-primary h-5 w-5 flex items-center justify-center rounded-full text-xs font-black ring-2 ring-primary/20">
                                    {itemCount}
                                </span>
                            )}
                        </div>
                        <div className="border-l border-white/30 pl-3 flex flex-col items-start leading-tight">
                            <span className="text-[11px] opacity-75">Sepetim</span>
                            <span className="text-sm font-bold">{totalAmount.toFixed(2)} ₺</span>
                        </div>
                    </button>
                </div>
            </SheetTrigger>

            {/* Drawer content */}
            <SheetContent className="w-full sm:max-w-sm flex flex-col h-full bg-white p-0">
                {/* Header */}
                <SheetHeader className="px-5 py-4 border-b border-gray-100 bg-white">
                    <SheetTitle className="flex items-center gap-2 font-black text-lg text-left">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                            <ShoppingBag className="w-4 h-4 text-primary" />
                        </div>
                        Sepetim
                        {itemCount > 0 && (
                            <span className="ml-auto text-xs font-semibold bg-primary text-white px-2.5 py-1 rounded-full">
                                {itemCount} ürün
                            </span>
                        )}
                    </SheetTitle>
                </SheetHeader>

                {/* Items */}
                <div className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50/60">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-16">
                            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                                <Package className="w-10 h-10 text-gray-300" />
                            </div>
                            <p className="text-gray-700 font-bold text-lg">Sepetiniz boş</p>
                            <p className="text-gray-400 text-sm mt-1">Menüden ürün ekleyerek başlayın</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm text-gray-900 leading-snug">{item.product.name}</h4>
                                            {item.selectedOptions.length > 0 && (
                                                <ul className="mt-1.5 space-y-0.5">
                                                    {item.selectedOptions.map((opt, i) => (
                                                        <li key={i} className="text-xs text-gray-500 flex justify-between">
                                                            <span>· {opt.variationName}: {opt.optionName}</span>
                                                            {opt.priceDelta > 0 && <span className="text-primary font-medium">+{opt.priceDelta} ₺</span>}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => onRemove(item.id)}
                                            className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center shrink-0 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100">
                                        <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg">
                                            {item.quantity} adet
                                        </span>
                                        <span className="font-black text-primary text-base">{item.totalPrice.toFixed(2)} ₺</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 bg-white border-t border-gray-100 space-y-4">
                    {/* Min order progress */}
                    {totalAmount > 0 && totalAmount < restaurant.minOrderAmount && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium text-gray-500">
                                <span>Min. sipariş: {restaurant.minOrderAmount} ₺</span>
                                <span className="text-orange-600 font-bold">{remaining.toFixed(2)} ₺ kaldı</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-orange-400 to-primary rounded-full transition-all duration-500"
                                    style={{ width: `${progressPct}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Total */}
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Toplam</span>
                        <span className="text-xl font-black text-gray-900">{totalAmount.toFixed(2)} ₺</span>
                    </div>

                    <Button
                        className="w-full h-13 text-base font-bold rounded-xl shadow-lg shadow-primary/30 disabled:opacity-40"
                        disabled={cart.length === 0 || totalAmount < restaurant.minOrderAmount}
                        onClick={() => setIsCheckoutOpen(true)}
                    >
                        Siparişi Tamamla
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </SheetContent>

            <CheckoutDialog
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
            />
        </Sheet>
    );
}
