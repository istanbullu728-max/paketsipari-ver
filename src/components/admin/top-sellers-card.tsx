"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame } from "lucide-react";
import { useOrders } from "@/components/order-provider";

export default function TopSellersCard() {
    const { orders } = useOrders();

    // Tally all product occurrences across all orders
    const productCount: Record<string, number> = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            productCount[item.productName] = (productCount[item.productName] || 0) + item.quantity;
        });
    });

    const sorted = Object.entries(productCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    const maxCount = sorted[0]?.[1] || 1;

    // Fallback mock data when no orders yet
    const displayItems = sorted.length > 0 ? sorted : [
        ["Adana Dürüm", 34],
        ["Urfa Porsiyon", 28],
        ["Lahmacun (5'li)", 22],
        ["Ayran (Büyük)", 19],
        ["Kutu Kola", 14],
    ] as [string, number][];

    const displayMax = (displayItems[0]?.[1] as number) || 1;

    return (
        <Card className="bg-white dark:bg-zinc-950 border-slate-100 dark:border-zinc-800 shadow-sm rounded-xl">
            <CardHeader className="p-6 pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2 dark:text-zinc-100">
                    <Flame className="w-5 h-5 text-orange-500" />
                    Popüler Lezzetler
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-4 space-y-4">
                {displayItems.map(([name, count], idx) => {
                    const pct = Math.round(((count as number) / displayMax) * 100);
                    return (
                        <div key={name as string} className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-500">
                                        {idx + 1}
                                    </span>
                                    <span className="font-medium text-zinc-800 dark:text-zinc-200 leading-tight">{name as string}</span>
                                </div>
                                <span className="font-bold text-zinc-500 dark:text-zinc-400 shrink-0">{count as number} adet</span>
                            </div>
                            <Progress
                                value={pct}
                                className="h-1.5 bg-zinc-100 dark:bg-zinc-800"
                            // indicatorClassName removed; apply colour via inline style workaround
                            />
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
