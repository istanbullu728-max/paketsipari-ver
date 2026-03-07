"use client";

import { useRestaurant } from "@/components/restaurant-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ShieldCheck, Download, CreditCard, AlertTriangle } from "lucide-react";

export default function SubscriptionPage() {
    const { restaurantData } = useRestaurant();

    // Mock data for UI
    const invoices = [
        { id: "INV-2026-001", date: "12 Mart 2026", type: "Yıllık Abonelik (İlk Kayıt)", amount: "Ücretsiz", status: "Tamamlandı" },
        // Add more if needed, but currently in trial, so just one initial record
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-24">

            {/* Header: Status Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-3">
                    {restaurantData.logoUrl ? (
                        <img src={restaurantData.logoUrl} alt={restaurantData.name} className="w-12 h-12 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0" />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
                            {restaurantData.name.charAt(0)}
                        </div>
                    )}
                    <div>
                        <h1 className="text-xl font-bold dark:text-zinc-100">{restaurantData.name}</h1>
                        <p className="text-sm text-zinc-500">Hesap Özeti ve Ödeme Yönetimi</p>
                    </div>
                </div>
                <div>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30 px-3 py-1.5 text-sm font-semibold whitespace-nowrap">
                        Ücretsiz Deneme
                    </Badge>
                </div>
            </div>

            {/* Trial Countdown Warning */}
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4 flex items-start sm:items-center gap-3 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
                <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                    <strong>Dikkat:</strong> Deneme sürenizin bitmesine <strong>5 gün</strong> kaldı. Kesintisiz hizmet için lütfen paketinizi yükseltin.
                </p>
            </div>

            {/* Main Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Card: Current Plan Details */}
                <Card className="col-span-1 border-zinc-200 dark:border-zinc-800 shadow-sm bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg text-zinc-700 dark:text-zinc-300">Mevcut Planınız</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-1">
                        <div>
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Plan Adı</p>
                            <p className="font-bold text-zinc-900 dark:text-zinc-100">Lansmana Özel Her Şey Dahil Paket</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Bitiş Tarihi</p>
                            <p className="font-bold text-zinc-900 dark:text-zinc-100">12 Mart 2027</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Kayıtlı Telefon <sup>(WhatsApp)</sup></p>
                            <p className="font-bold text-zinc-900 dark:text-zinc-100">+{restaurantData.whatsappNumber || "90 5XX XXX XX XX"}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Right/Center Card: Upgrade Area */}
                <Card className="col-span-1 md:col-span-2 border-zinc-200 dark:border-zinc-800 shadow-sm border-t-[5px] border-t-emerald-500 bg-white dark:bg-zinc-950 flex flex-col">
                    <CardHeader className="pb-2 relative pt-8">
                        <Badge className="absolute -top-3.5 left-6 bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-800/80 dark:text-emerald-200 dark:hover:bg-emerald-800 dark:border-emerald-700/50 border border-emerald-200 text-xs px-2.5 py-0.5 shadow-sm">Tavsiye Edilen</Badge>
                        <CardTitle className="text-2xl font-black">Yıllık Sınırsız Kullanım</CardTitle>
                        <div className="mt-2 text-4xl font-black text-emerald-600 dark:text-emerald-400 flex items-end gap-3 flex-wrap">
                            3.500 TL
                            <span className="text-lg font-medium text-zinc-400 line-through mb-1">7.000 TL</span>
                        </div>
                        <CardDescription className="text-sm mt-1">Tek seferlik yıllık ödeme. Komisyon yok, sürpriz ücret yok.</CardDescription>
                    </CardHeader>

                    <CardContent className="pt-4 flex-1">
                        <ul className="space-y-3">
                            {["Komisyonsuz Sınırsız Sipariş", "WhatsApp Bildirim Hattı Tam Entegrasyonu", "Sınırsız Menü ve Ürün Güncelleme", "Ücretsiz Broşür ve Magnet Tasarım Aracı", "Öncelikli Teknik Destek"].map((feature, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                    <span className="mt-0.5">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>

                    <CardFooter className="flex-col pb-6 pt-2 bg-white dark:bg-zinc-950 border-t-0 p-6">
                        <Button className="w-full h-14 text-lg font-bold bg-[#1ca653] hover:bg-[#158742] text-white shadow-lg shadow-[#1ca653]/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]">
                            <CreditCard className="w-5 h-5 shrink-0" />
                            Kredi Kartı ile Hemen Aktif Et
                        </Button>
                        <div className="mt-5 flex flex-col items-center opacity-80 select-none w-full">
                            <p className="text-[11px] font-semibold text-zinc-400 flex items-center justify-center gap-1.5 uppercase tracking-wider mb-3">
                                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" /> 256-Bit Güvenli Ödeme
                            </p>
                            <div className="flex items-center justify-center gap-3 w-full grayscale opacity-60 flex-wrap">
                                <span className="font-extrabold text-sm italic border px-2 py-0.5 rounded border-zinc-300">Visa</span>
                                <span className="font-extrabold text-sm border px-2 py-0.5 rounded border-zinc-300">MasterCard</span>
                                <span className="font-bold text-sm tracking-tighter border px-2 py-0.5 rounded border-zinc-300 bg-zinc-100 text-zinc-800">TROY</span>
                                <span className="font-bold text-sm text-red-700 italic border px-2 py-0.5 rounded border-zinc-300 bg-zinc-100">Bonus</span>
                                <span className="font-bold text-sm italic border px-2 py-0.5 rounded border-zinc-300">Maximum</span>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* Bottom Section: Invoice History */}
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950">
                <CardHeader>
                    <CardTitle className="text-lg">Fatura Geçmişi</CardTitle>
                    <CardDescription>Önceki ödemelerinizi ve faturalarınızı buradan indirebilirsiniz.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto text-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase tracking-wider text-[11px] font-semibold">
                                    <th className="py-3 font-medium px-2">Tarih</th>
                                    <th className="py-3 font-medium px-2">İşlem Tipi</th>
                                    <th className="py-3 font-medium px-2">Tutar</th>
                                    <th className="py-3 font-medium px-2">Durum</th>
                                    <th className="py-3 text-right font-medium px-2">Fatura</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="border-b border-zinc-100 dark:border-zinc-900/50 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="py-4 font-medium dark:text-zinc-200 px-2 min-w-[100px]">{inv.date}</td>
                                        <td className="py-4 text-zinc-600 dark:text-zinc-400 px-2 min-w-[200px]">{inv.type}</td>
                                        <td className="py-4 font-bold dark:text-zinc-200 px-2">{inv.amount}</td>
                                        <td className="py-4 px-2">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 whitespace-nowrap">
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right px-2">
                                            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-zinc-500 hover:text-emerald-600 justify-end w-full sm:w-auto px-2" disabled>
                                                <Download className="w-3.5 h-3.5 shrink-0" />
                                                <span className="hidden sm:inline">İndir</span>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
