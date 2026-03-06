"use client";

import { useOrders } from "@/components/order-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, CheckCircle, Users } from "lucide-react";
import dynamic from "next/dynamic";
import TopSellersCard from "@/components/admin/top-sellers-card";
import LoyalCustomersCard from "@/components/admin/loyal-customers-card";


// Recharts must be client-only; dynamic import avoids SSR issues
const WeeklySalesChart = dynamic(() => import("@/components/admin/weekly-sales-chart"), { ssr: false });

export default function AdminDashboardPage() {
    const { getMetrics } = useOrders();
    const metrics = getMetrics();

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight dark:text-zinc-100">Özet İzleme</h1>
                <p className="text-zinc-500 mt-2">Mağazanızın anlık performansını takip edin.</p>
            </div>

            {/* ── Top KPI Cards ─────────────────────── */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-white dark:bg-zinc-950 border-slate-100 dark:border-zinc-800 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Bugünkü Ciro</CardTitle>
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-full">
                            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{metrics.todayRevenue.toLocaleString("tr-TR")} TL</div>
                        <p className="text-xs text-zinc-500 mt-1">Düne göre +%12</p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-zinc-950 border-slate-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-amber-500/20" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
                        <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Bekleyen Siparişler</CardTitle>
                        <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-full">
                            <ShoppingBag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{metrics.pendingCount}</div>
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">Hemen ilgilenilmesi gerekiyor</p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-zinc-950 border-slate-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-emerald-500/20" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
                        <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Tamamlananlar</CardTitle>
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-full">
                            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{metrics.completedCount}</div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">Bugün teslim edilenler</p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-zinc-950 border-slate-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-blue-500/20" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
                        <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Aktif Ziyaretçi</CardTitle>
                        <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-full">
                            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                            </span>
                            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{metrics.activeVisitors}</div>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">Şu an mağazada geziniyor</p>
                    </CardContent>
                </Card>
            </div>

            {/* ── Chart  +  Smart Side Cards ────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Wide: Area Chart */}
                <div className="lg:col-span-2">
                    <WeeklySalesChart />
                </div>

                {/* Narrow: stacked info cards */}
                <div className="flex flex-col gap-6">
                    <TopSellersCard />
                    <LoyalCustomersCard />
                </div>
            </div>


        </div>
    );
}
