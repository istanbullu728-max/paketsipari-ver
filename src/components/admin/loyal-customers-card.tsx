"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, MessageCircle } from "lucide-react";
import { useOrders } from "@/components/order-provider";

const LOYALTY_GOAL = 5;

export default function LoyalCustomersCard() {
    const { orders } = useOrders();

    const customerMap: Record<string, { name: string; phone: string; count: number }> = {};
    orders.forEach(order => {
        const key = order.customerPhone;
        if (!customerMap[key]) {
            customerMap[key] = { name: order.customerName, phone: order.customerPhone, count: 0 };
        }
        customerMap[key].count += 1;
    });

    const topCustomers = Object.values(customerMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

    const displayCustomers = topCustomers;

    const openWhatsApp = (phone: string, name: string) => {
        const cleanPhone = phone.replace(/[^0-9]/g, "");
        const msg = `Merhaba ${name.split(" ")[0]}! Sizi çok seviyoruz 🎉 Bir sonraki siparişinizde özel indirim kazandınız!`;
        window.open(`https://wa.me/90${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
    };

    return (
        <Card className="bg-white dark:bg-zinc-950 border-slate-100 dark:border-zinc-800 shadow-sm rounded-xl">
            <CardHeader className="p-6 pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2 dark:text-zinc-100">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    En Sadık Müşteriler
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-4 space-y-5">
                {displayCustomers.map((customer, idx) => {
                    const filled = Math.min(customer.count % LOYALTY_GOAL || LOYALTY_GOAL, LOYALTY_GOAL);
                    const punchesLeft = LOYALTY_GOAL - filled;
                    return (
                        <div key={customer.phone} className="flex items-center gap-3">
                            {/* Rank badge */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${idx === 0 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400" : idx === 1 ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400" : "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"}`}>
                                {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">{customer.name}</p>
                                {/* Punch card dots */}
                                <div className="flex gap-1 mt-1.5">
                                    {Array.from({ length: LOYALTY_GOAL }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${i < filled
                                                ? "bg-emerald-500 border-emerald-500"
                                                : "border-zinc-200 dark:border-zinc-700"
                                                }`}
                                        >
                                            {i < filled && (
                                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                                                    <path d="M2 4.5l1.5 1.5L6 2.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                                                </svg>
                                            )}
                                        </div>
                                    ))}
                                    <span className="ml-1 text-[10px] text-zinc-400 self-center">
                                        {punchesLeft === 0 ? "🎉 Ücretsiz!" : `${filled}/${LOYALTY_GOAL}`}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => openWhatsApp(customer.phone, customer.name)}
                                className="shrink-0 p-2 rounded-full text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors"
                                title="WhatsApp ile mesaj gönder"
                            >
                                <MessageCircle className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
