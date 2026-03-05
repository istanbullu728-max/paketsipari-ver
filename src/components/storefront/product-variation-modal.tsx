"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { CartItem } from "./storefront-client";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus } from "lucide-react";

export default function ProductVariationModal({
    product,
    onClose,
    onAddToCart,
}: {
    product: Product | null;
    onClose: () => void;
    onAddToCart: (item: CartItem) => void;
}) {
    const [selections, setSelections] = useState<Record<string, string[]>>({});
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (product) {
            setQuantity(1);
            const initialSelections: Record<string, string[]> = {};
            product.variations.forEach(v => {
                if (v.isRequired && v.options.length > 0) {
                    initialSelections[v.id] = [v.options[0].id];
                } else {
                    initialSelections[v.id] = [];
                }
            });
            setSelections(initialSelections);
        }
    }, [product]);

    if (!product) return null;

    const handleSelection = (variationId: string, optionId: string, isSingleChoice: boolean) => {
        setSelections(prev => {
            if (isSingleChoice) {
                return { ...prev, [variationId]: [optionId] };
            } else {
                const current = prev[variationId] || [];
                if (current.includes(optionId)) {
                    return { ...prev, [variationId]: current.filter(id => id !== optionId) };
                } else {
                    return { ...prev, [variationId]: [...current, optionId] };
                }
            }
        });
    };

    const calculateTotal = () => {
        let extra = 0;
        Object.keys(selections).forEach(vId => {
            const selectedOptIds = selections[vId];
            const variation = product.variations.find(v => v.id === vId);
            if (variation) {
                selectedOptIds.forEach(optId => {
                    const opt = variation.options.find(o => o.id === optId);
                    if (opt) extra += opt.priceDelta;
                });
            }
        });
        return (product.price + extra) * quantity;
    };

    const handleAdd = () => {
        const missingRequired = product.variations.filter(
            v => v.isRequired && (!selections[v.id] || selections[v.id].length === 0)
        );
        if (missingRequired.length > 0) {
            alert(`Lütfen zorunlu seçimleri yapınız: ${missingRequired.map(v => v.name).join(", ")}`);
            return;
        }

        const selectedOptionsList: CartItem["selectedOptions"] = [];
        Object.keys(selections).forEach(vId => {
            const selectedOptIds = selections[vId];
            const variation = product.variations.find(v => v.id === vId);
            if (variation) {
                selectedOptIds.forEach(optId => {
                    const opt = variation.options.find(o => o.id === optId);
                    if (opt) {
                        selectedOptionsList.push({
                            variationId: variation.id,
                            variationName: variation.name,
                            optionId: opt.id,
                            optionName: opt.name,
                            priceDelta: opt.priceDelta
                        });
                    }
                });
            }
        });

        onAddToCart({
            id: Date.now().toString(),
            product,
            quantity,
            selectedOptions: selectedOptionsList,
            totalPrice: calculateTotal(),
        });
    };

    return (
        <Sheet open={!!product} onOpenChange={open => !open && onClose()}>
            <SheetContent
                side="bottom"
                className="h-[92dvh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl sm:max-w-lg sm:mx-auto sm:bottom-4 sm:left-auto sm:right-4 p-0 border-0 shadow-2xl flex flex-col"
            >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
                    <div className="w-10 h-1 rounded-full bg-zinc-200" />
                </div>

                {/* Product image */}
                {product.imageUrl && (
                    <div className="w-full h-44 sm:h-52 bg-gray-100 shrink-0 relative overflow-hidden">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                )}

                {/* Header */}
                <SheetHeader className="px-5 pt-4 pb-3 shrink-0">
                    <SheetTitle className="text-xl flex justify-between items-start gap-2">
                        <span className="leading-tight">{product.name}</span>
                        <span className="text-primary font-black shrink-0">{product.price} TL</span>
                    </SheetTitle>
                    {product.description && (
                        <p className="text-sm text-gray-500 mt-1 text-left">{product.description}</p>
                    )}
                </SheetHeader>

                {/* Options scroll area */}
                <ScrollArea className="flex-1 px-5">
                    <div className="pb-4 space-y-5 mt-2">
                        {product.variations.map(variation => {
                            const isSingleChoice = variation.isRequired;
                            return (
                                <div key={variation.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-semibold text-sm">{variation.name}</h4>
                                        {variation.isRequired && (
                                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Zorunlu</span>
                                        )}
                                    </div>

                                    {isSingleChoice ? (
                                        <RadioGroup
                                            value={selections[variation.id]?.[0]}
                                            onValueChange={(val: string) => handleSelection(variation.id, val, true)}
                                            className="space-y-3"
                                        >
                                            {variation.options.map(opt => (
                                                <div key={opt.id} className="flex items-center justify-between min-h-[36px]">
                                                    <div className="flex items-center space-x-3">
                                                        <RadioGroupItem value={opt.id} id={opt.id} className="shrink-0" />
                                                        <Label htmlFor={opt.id} className="cursor-pointer text-sm leading-snug">{opt.name}</Label>
                                                    </div>
                                                    {opt.priceDelta > 0 && <span className="text-sm text-gray-500 font-medium shrink-0">+{opt.priceDelta} TL</span>}
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    ) : (
                                        <div className="space-y-3">
                                            {variation.options.map(opt => (
                                                <div key={opt.id} className="flex items-center justify-between min-h-[36px]">
                                                    <div className="flex items-center space-x-3">
                                                        <Checkbox
                                                            id={opt.id}
                                                            checked={selections[variation.id]?.includes(opt.id)}
                                                            onCheckedChange={() => handleSelection(variation.id, opt.id, false)}
                                                            className="shrink-0"
                                                        />
                                                        <Label htmlFor={opt.id} className="cursor-pointer text-sm leading-snug">{opt.name}</Label>
                                                    </div>
                                                    {opt.priceDelta > 0 && <span className="text-sm text-gray-500 font-medium shrink-0">+{opt.priceDelta} TL</span>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>

                {/* Footer — sticky at bottom */}
                <div className="p-4 border-t bg-white shrink-0 flex items-center gap-3 safe-area-pb">
                    {/* Quantity */}
                    <div className="flex items-center bg-gray-100 rounded-xl p-1 border shrink-0">
                        <Button
                            variant="ghost" size="icon"
                            className="h-10 w-10 rounded-lg hover:bg-white"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            type="button"
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-9 text-center font-bold text-sm">{quantity}</span>
                        <Button
                            variant="ghost" size="icon"
                            className="h-10 w-10 rounded-lg hover:bg-white"
                            onClick={() => setQuantity(quantity + 1)}
                            type="button"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button
                        onClick={handleAdd}
                        className="flex-1 h-12 text-sm font-bold shadow-md rounded-xl"
                    >
                        Sepete Ekle &bull; {calculateTotal().toFixed(2)} TL
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
