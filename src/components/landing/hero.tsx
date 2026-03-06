"use client";

import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    <div className="flex-1 max-w-2xl text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold mb-6 animate-fade-in">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            YENİ: Yıllık Üyeliklerde %30 İndirim!
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-[1.1] mb-6">
                            Kendi Paket Servis Sistemini <span className="text-primary italic">5 Dakikada</span> Kur
                        </h1>

                        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Aracı komisyonlar olmadan, kontrolü eline al. Dijital menünü oluştur, WhatsApp siparişlerini anında yönet ve işletmeni büyüt.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                            <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all w-full sm:w-auto">
                                Hemen Ücretsiz Başla
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold border-2 w-full sm:w-auto hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
                                <PlayCircle className="mr-2 w-5 h-5" />
                                Demoyu İzle
                            </Button>
                        </div>

                        <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-zinc-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Kredi Kartı Gerekmez</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Komisyon Yok</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 relative w-full max-w-2xl animate-float">
                        <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-[80px] -z-10 scale-90" />
                        <div className="relative bg-white dark:bg-zinc-900 p-2 md:p-3 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden group">
                            <div className="bg-zinc-50 dark:bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-1.5 p-3 bg-zinc-100/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                </div>
                                <div className="aspect-[4/3] bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 flex items-center justify-center p-4">
                                    {/* Dashboard Mockup Content - High Impact Visual */}
                                    <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-xl shadow-inner border border-zinc-200/50 dark:border-zinc-800/50 p-4 space-y-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
                                            <div className="h-8 w-8 bg-primary/10 rounded-full" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="h-20 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl border border-emerald-100/50 dark:border-emerald-500/10 p-3">
                                                <div className="h-2 w-12 bg-emerald-200 dark:bg-emerald-900/50 rounded-full mb-2" />
                                                <div className="h-5 w-20 bg-emerald-500 rounded-full" />
                                            </div>
                                            <div className="h-20 bg-primary/5 rounded-xl border border-primary/10 p-3">
                                                <div className="h-2 w-12 bg-primary/20 rounded-full mb-2" />
                                                <div className="h-5 w-16 bg-primary/40 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="h-32 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-6 -right-6 md:-top-10 md:-right-10 bg-white dark:bg-zinc-950 p-4 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 animate-bounce-slow hidden sm:block">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-full">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Yeni Sipariş</p>
                                    <p className="text-sm font-bold">Lezzet Burger #42</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
