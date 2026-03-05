"use client";

import { useOrders } from "@/components/order-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Phone, MapPin, Receipt, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminCustomersPage() {
    const { orders } = useOrders();

    // Group orders by unique phone number to represent distinct customers
    const uniqueCustomersMap = new Map();

    orders.forEach(order => {
        if (!uniqueCustomersMap.has(order.customerPhone)) {
            uniqueCustomersMap.set(order.customerPhone, {
                name: order.customerName,
                phone: order.customerPhone,
                latestAddress: order.customerAddress,
                totalOrders: 1,
                totalSpent: order.totalAmount,
                lastOrderDate: order.createdAt
            });
        } else {
            const customer = uniqueCustomersMap.get(order.customerPhone);
            customer.totalOrders += 1;
            customer.totalSpent += order.totalAmount;
            if (new Date(order.createdAt) > new Date(customer.lastOrderDate)) {
                customer.lastOrderDate = order.createdAt;
                customer.latestAddress = order.customerAddress; // update to most recent address
            }
        }
    });

    const customers = Array.from(uniqueCustomersMap.values()).sort((a, b) => b.totalOrders - a.totalOrders);

    const openWhatsApp = (phone: string, name: string) => {
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        const message = `Merhaba ${name.split(" ")[0]}, Paketservis'ten ulaşıyoruz. Size özel indirimlerimiz mevcuttur.`;
        const waLink = `https://wa.me/90${cleanPhone}?text=${encodeURIComponent(message)}`;
        window.open(waLink, "_blank");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Müşterilerim</h1>
                <p className="text-zinc-500 mt-2">Sipariş veren müşterilerinizin kayıtları ve sipariş istatistikleri.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {customers.map((customer, idx) => (
                    <Card key={idx} className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3 items-center">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 font-bold flex flex-col items-center justify-center shrink-0">
                                        {customer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg leading-tight dark:text-zinc-100">{customer.name}</CardTitle>
                                        <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                                            <Phone className="w-3 h-3" />
                                            {customer.phone}
                                        </CardDescription>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                <MapPin className="w-4 h-4 shrink-0 text-zinc-400" />
                                <span className="line-clamp-2 leading-relaxed">{customer.latestAddress}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg p-3 border border-zinc-100 dark:border-zinc-800">
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Sipariş Sayısı</p>
                                    <p className="text-lg font-bold flex items-center gap-1 text-zinc-900 dark:text-zinc-100">
                                        <Receipt className="w-4 h-4 text-zinc-400" /> {customer.totalOrders}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Toplam Harcama</p>
                                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                        {customer.totalSpent} TL
                                    </p>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full gap-2 border-green-200 text-green-700 hover:bg-green-50 dark:border-green-900/50 dark:text-green-500 dark:hover:bg-green-950/30"
                                onClick={() => openWhatsApp(customer.phone, customer.name)}
                            >
                                <MessageCircle className="w-4 h-4" />
                                Tekrar Ulaş (Kampanya)
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {customers.length === 0 && (
                <div className="text-center py-12 text-zinc-500 border border-dashed rounded-xl border-zinc-200 dark:border-zinc-800">
                    Henüz hiç müşteriniz bulunmuyor. Sipariş alındıkça bu alan otomatik dolacaktır.
                </div>
            )}
        </div>
    );
}
