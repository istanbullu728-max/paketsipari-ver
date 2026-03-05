"use client";

import { useState } from "react";
import { Ticket, QrCode, MessageCircle, Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrders } from "@/components/order-provider";
import { useRestaurant } from "@/components/restaurant-provider";

function generateCode(prefix: string) {
    return `${prefix}${Math.random().toString(36).toUpperCase().slice(2, 8)}`;
}

export default function QuickActionsBand() {
    const [discountOpen, setDiscountOpen] = useState(false);
    const [discountCode, setDiscountCode] = useState("");
    const [discountPct, setDiscountPct] = useState("10");
    const [copied, setCopied] = useState(false);
    const { orders } = useOrders();
    const { restaurantData } = useRestaurant();

    const generateDiscount = () => {
        setDiscountCode(generateCode("MPS"));
    };

    const copyCode = () => {
        if (!discountCode) return;
        navigator.clipboard.writeText(discountCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Best customer = highest spend today
    const today = new Date();
    const todayOrders = orders.filter(o =>
        o.createdAt.getDate() === today.getDate() &&
        o.createdAt.getMonth() === today.getMonth() &&
        o.createdAt.getFullYear() === today.getFullYear()
    );
    const bestCustomer = todayOrders.sort((a, b) => b.totalAmount - a.totalAmount)[0];

    const sendWhatsAppToBest = () => {
        if (!bestCustomer) return;
        const cleanPhone = bestCustomer.customerPhone.replace(/[^0-9]/g, "");
        const msg = `Merhaba ${bestCustomer.customerName.split(" ")[0]}! Bugünkü en iyi müşterimizsiniz 🌟 Bir sonraki siparişinizde %10 indirim kazandınız. Kod: ${generateCode("VIP")}`;
        window.open(`https://wa.me/90${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
    };

    const qrHref = `/admin/qr`;

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Card 1 – Discount Code */}
                <button
                    onClick={() => setDiscountOpen(true)}
                    className="group text-left bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 shadow-sm rounded-xl p-6 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md transition-all"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                            <Ticket className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">Hızlı İşlem</span>
                    </div>
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Yeni İndirim Kodu</h3>
                    <p className="text-sm text-zinc-500 mt-1">Özel kampanya kodu oluştur ve paylaş.</p>
                </button>

                {/* Card 2 – QR Brochure */}
                <a
                    href={qrHref}
                    className="group text-left bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 shadow-sm rounded-xl p-6 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all block"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                            <QrCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">PDF</span>
                    </div>
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100">QR Kodlu Broşür</h3>
                    <p className="text-sm text-zinc-500 mt-1">Mağazanızın QR broşürünü indirin.</p>
                </a>

                {/* Card 3 – WhatsApp Best Customer */}
                <button
                    onClick={sendWhatsAppToBest}
                    disabled={!bestCustomer}
                    className="group text-left bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 shadow-sm rounded-xl p-6 hover:border-green-200 dark:hover:border-green-800 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-xl">
                            <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">WhatsApp</span>
                    </div>
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100">En İyi Müşteriye Not</h3>
                    <p className="text-sm text-zinc-500 mt-1">
                        {bestCustomer ? `${bestCustomer.customerName} – Bugünkü en yüksek harcama` : "Bugün için sipariş bulunmuyor"}
                    </p>
                </button>
            </div>

            {/* Discount Modal */}
            {discountOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setDiscountOpen(false)}>
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative" onClick={e => e.stopPropagation()}>
                        <button className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200" onClick={() => setDiscountOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                                <Ticket className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h2 className="font-bold text-lg dark:text-zinc-100">İndirim Kodu Oluştur</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">İndirim Oranı (%)</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={90}
                                    value={discountPct}
                                    onChange={e => setDiscountPct(e.target.value)}
                                    className="mt-1"
                                />
                            </div>

                            <Button
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={generateDiscount}
                            >
                                Kod Oluştur
                            </Button>

                            {discountCode && (
                                <div className="flex gap-2 items-center bg-zinc-50 dark:bg-zinc-800 rounded-xl p-3 border border-zinc-200 dark:border-zinc-700">
                                    <code className="flex-1 font-mono text-lg font-black text-emerald-600 dark:text-emerald-400 tracking-widest">
                                        {discountCode}
                                    </code>
                                    <button
                                        onClick={copyCode}
                                        className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors text-zinc-500"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            )}
                            {discountCode && (
                                <p className="text-xs text-center text-zinc-500">
                                    {discountPct}% indirim kodu hazır. Müşterilerinizle paylaşın!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
