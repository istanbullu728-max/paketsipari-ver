"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { CartItem } from "./storefront-client";
import { useRestaurant } from "@/components/restaurant-provider";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOrders } from "@/components/order-provider";

// Leaflet must be client-only — SSR: false avoids window undefined errors
const MapAddressPicker = dynamic(() => import("./map-address-picker"), { ssr: false });

export default function CheckoutDialog({
    isOpen,
    onClose,
    cart,
}: {
    isOpen: boolean;
    onClose: () => void;
    cart: CartItem[];
}) {
    const { restaurantData: restaurant } = useRestaurant();
    const { addOrder } = useOrders();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        note: "",
    });
    const [isValidating, setIsValidating] = useState(false);
    const [validationMessage, setValidationMessage] = useState<{ type: 'error' | 'success' | null, text: string }>({ type: null, text: "" });

    const validateAddress = (addr: string) => {
        if (!addr || !restaurant.serviceAreas || restaurant.serviceAreas.length === 0) {
            setValidationMessage({ type: null, text: "" });
            return true;
        }

        setIsValidating(true);
        const lowerAddr = addr.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
        
        let foundMatch = false;
        
        for (const area of restaurant.serviceAreas) {
            const cleanCity = area.city.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
            const cleanDistrict = area.district.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
            
            // Check if city AND district match
            if (lowerAddr.includes(cleanCity) && lowerAddr.includes(cleanDistrict)) {
                // If neighborhoods are specified, at least one must match
                if (area.neighborhoods.length > 0) {
                    const matchMahalle = area.neighborhoods.some(n => {
                        const cleanN = n.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
                        return lowerAddr.includes(cleanN);
                    });
                    if (matchMahalle) {
                        foundMatch = true;
                        break;
                    }
                } else {
                    // Entire district matches
                    foundMatch = true;
                    break;
                }
            }
        }

        setIsValidating(false);
        if (!foundMatch) {
            setValidationMessage({ 
                type: 'error', 
                text: "Üzgünüz, bu bölgeye şu an hizmet veremiyoruz." 
            });
            return false;
        } else {
            setValidationMessage({ 
                type: 'success', 
                text: "Adresiniz hizmet bölgemiz içerisinde." 
            });
            return true;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'address') {
            validateAddress(value);
        }
    };

    const handleMapPick = (address: string, _lat: number, _lng: number) => {
        setFormData(prev => ({ ...prev, address }));
        validateAddress(address);
    };

    const generateWhatsAppMessage = () => {
        let message = `*Yeni Sipariş - ${restaurant.name}*\n\n`;
        message += `*Müşteri Bilgileri:*\n`;
        message += `Ad Soyad: ${formData.name}\n`;
        message += `Telefon: ${formData.phone}\n`;
        message += `Adres:\n${formData.address}\n\n`;
        if (formData.note) message += `Not:\n${formData.note}\n\n`;
        message += `*Sipariş Detayı:*\n`;
        let total = 0;
        cart.forEach(item => {
            message += `- ${item.quantity}x ${item.product.name} (Adet: ${item.product.price} TL)\n`;
            if (item.selectedOptions.length > 0) {
                item.selectedOptions.forEach(opt => {
                    message += `  ↳ ${opt.variationName}: ${opt.optionName}`;
                    if (opt.priceDelta > 0) message += ` (+${opt.priceDelta} TL)`;
                    message += `\n`;
                });
            }
            message += `  *Alt Toplam: ${item.totalPrice.toFixed(2)} TL*\n\n`;
            total += item.totalPrice;
        });
        message += `*Genel Toplam: ${total.toFixed(2)} TL*`;
        return encodeURIComponent(message);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const orderItems = cart.map(item => ({
            id: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            options: item.selectedOptions.map(opt => `${opt.variationName}: ${opt.optionName}`)
        }));
        const totalOrderAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);
        addOrder({
            customerName: formData.name,
            customerPhone: formData.phone,
            customerAddress: formData.address,
            customerNote: formData.note,
            items: orderItems,
            totalAmount: totalOrderAmount,
        });
        let cleanPhone = restaurant.whatsappNumber.replace(/[^0-9]/g, '');
        if (!cleanPhone.startsWith('90')) {
            cleanPhone = '90' + cleanPhone.replace(/^0/, '');
        }
        window.open(`https://wa.me/${cleanPhone}?text=${generateWhatsAppMessage()}`, "_blank");
        onClose();
    };

    return (
        <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
            {/* Full screen on mobile, right drawer on desktop */}
            <SheetContent
                side="bottom"
                className="h-[95dvh] sm:h-auto sm:max-h-[92vh] rounded-t-3xl sm:rounded-3xl sm:max-w-lg sm:mx-auto sm:bottom-4 sm:left-auto sm:right-4 overflow-y-auto p-0 border-0 shadow-2xl"
            >
                {/* Handle bar (mobile) */}
                <div className="flex justify-center pt-3 pb-1 sm:hidden">
                    <div className="w-10 h-1 rounded-full bg-zinc-200" />
                </div>

                <SheetHeader className="px-5 pt-4 pb-3 border-b border-zinc-100">
                    <SheetTitle className="text-lg font-bold">Teslimat Bilgileri</SheetTitle>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4 pb-8">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm font-medium">Ad Soyad</Label>
                        <Input
                            id="name" name="name" required
                            value={formData.name} onChange={handleChange}
                            placeholder="Örn: Ali Yılmaz"
                            className="h-11 text-base"
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-sm font-medium">Telefon Numarası</Label>
                        <Input
                            id="phone" name="phone" required type="tel"
                            value={formData.phone} onChange={handleChange}
                            placeholder="0555 555 55 55"
                            className="h-11 text-base"
                            inputMode="tel"
                        />
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="address" className="text-sm font-medium">Teslimat Adresi</Label>
                            {formData.address.length >= 5 && (
                                <button 
                                    type="button"
                                    onClick={() => {
                                        // Update state to trigger useEffect in MapAddressPicker
                                        // We just re-set it to itself but we might need a way to force it.
                                        // The MapAddressPicker debounces anyway.
                                        const current = formData.address;
                                        setFormData(prev => ({ ...prev, address: current + " " }));
                                        setTimeout(() => setFormData(prev => ({ ...prev, address: current })), 50);
                                    }}
                                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full transition-colors"
                                >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Konumu Haritada Bul
                                </button>
                            )}
                        </div>
                        <Textarea
                            id="address" name="address" required
                            value={formData.address} onChange={handleChange}
                            placeholder="Mahalle, Sokak, Bina No, Kapı No"
                            className="resize-none h-20 text-base"
                        />
                        
                        {/* Validation Feedback */}
                        {validationMessage.type && (
                            <div className={`flex items-start gap-2 p-3 rounded-xl border text-[13px] font-medium animate-in fade-in slide-in-from-top-1 duration-300 ${
                                validationMessage.type === 'error' 
                                ? "bg-red-50 text-red-700 border-red-100" 
                                : "bg-emerald-50 text-emerald-700 border-emerald-100"
                            }`}>
                                {validationMessage.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
                                <span>{validationMessage.text}</span>
                            </div>
                        )}
                    </div>

                    {/* Map — always visible */}
                    <div className="space-y-1.5">
                        <Label className="flex items-center gap-1.5 text-sm text-zinc-500">
                            <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            Harita üzerinde konum belirleyin
                        </Label>
                        {isOpen && (
                            <MapAddressPicker
                                address={formData.address}
                                onChange={handleMapPick}
                            />
                        )}
                    </div>

                    {/* Note */}
                    <div className="space-y-1.5">
                        <Label htmlFor="note" className="text-sm font-medium">
                            Sipariş Notu{" "}
                            <span className="text-zinc-400 font-normal">(İsteğe bağlı)</span>
                        </Label>
                        <Textarea
                            id="note" name="note"
                            value={formData.note} onChange={handleChange}
                            placeholder="Bulunması zor ise tarif edebilirsiniz…"
                            className="resize-none h-16 text-base"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={validationMessage.type === 'error' || isValidating}
                        className={`w-full h-14 bg-[#25D366] hover:bg-[#1da84e] text-white flex gap-2 text-base font-bold shadow-lg mt-2 transition-all ${
                            (validationMessage.type === 'error' || isValidating) ? "grayscale opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                        </svg>
                        Siparişi WhatsApp'a İlet
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}
