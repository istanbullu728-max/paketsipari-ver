"use client";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useOrders } from "@/components/order-provider";
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl shadow-lg p-3 text-sm">
                <p className="font-bold text-zinc-700 dark:text-zinc-300 mb-2">{label}</p>
                {payload.map((entry: any) => (
                    <p key={entry.name} className="text-xs" style={{ color: entry.color }}>
                        {entry.name === "ciro" ? `Ciro: ${entry.value.toLocaleString("tr-TR")} TL` : 
                         entry.name === "sipariş" ? `Sipariş: ${entry.value}` : 
                         `İptal: ${entry.value}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function WeeklySalesChart() {
    const { orders } = useOrders();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weeklyData = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (6 - i));
        
        const dayOrders = orders.filter(o => 
            o.createdAt.getDate() === d.getDate() && 
            o.createdAt.getMonth() === d.getMonth() && 
            o.createdAt.getFullYear() === d.getFullYear()
        );

        const ordersCount = dayOrders.filter(o => o.status !== "cancelled").length;
        const cancelledCount = dayOrders.filter(o => o.status === "cancelled").length;
        const revenue = dayOrders.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + o.totalAmount, 0);

        const dayName = new Intl.DateTimeFormat('tr-TR', { weekday: 'short' }).format(d);
        const formattedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

        return { day: formattedDayName, sipariş: ordersCount, iptal: cancelledCount, ciro: revenue };
    });
    const totalRevenue = weeklyData.reduce((sum, d) => sum + d.ciro, 0);
    const totalOrders = weeklyData.reduce((sum, d) => sum + d.sipariş, 0);

    return (
        <Card className="bg-white dark:bg-zinc-950 border-slate-100 dark:border-zinc-800 shadow-sm rounded-xl">
            <CardHeader className="p-6 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle className="text-lg font-bold flex items-center gap-2 dark:text-zinc-100">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            Haftalık Satış Analizi
                        </CardTitle>
                        <CardDescription className="mt-1">Son 7 günün ciro ve sipariş karşılaştırması</CardDescription>
                    </div>
                    <div className="flex gap-4 text-sm shrink-0">
                        <div className="text-center">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Toplam Ciro</p>
                            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{totalRevenue.toLocaleString("tr-TR")} TL</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Sipariş</p>
                            <p className="text-xl font-black text-zinc-900 dark:text-zinc-100">{totalOrders}</p>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 pt-4">
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                        <defs>
                            <linearGradient id="colorCiro" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorSiparis" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorIptal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-zinc-800" />
                        <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="ciro"
                            name="ciro"
                            stroke="#10b981"
                            strokeWidth={2.5}
                            fill="url(#colorCiro)"
                            dot={false}
                            activeDot={{ r: 5, fill: "#10b981" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="sipariş"
                            name="sipariş"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            fill="url(#colorSiparis)"
                            dot={false}
                            activeDot={{ r: 5, fill: "#f59e0b" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="iptal"
                            name="iptal"
                            stroke="#ef4444"
                            strokeWidth={2}
                            fill="url(#colorIptal)"
                            dot={false}
                            activeDot={{ r: 5, fill: "#ef4444" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-2 justify-center text-[10px] sm:text-xs text-zinc-500 flex-wrap">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>Ciro (TL)</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>Sipariş</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>İptal Edilen</span>
                </div>
            </CardContent>
        </Card>
    );
}
