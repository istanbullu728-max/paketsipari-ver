"use client";

import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";

export function Hero() {
    return (
        <section className="relative pt-24 pb-16 md:pt-48 md:pb-32 overflow-hidden">
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

                        <h1 className="text-[32px] sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-[1.15] mb-6">
                            Aracıya Komisyon Ödemeyi Bırakın, <span className="text-primary italic">5 dakikada</span> paket sipariş sitenizi kurun
                        </h1>

                        <p className="text-base md:text-xl text-zinc-600 dark:text-zinc-400 mb-8 md:10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            WhatsApp entegrasyonlu, akıllı zil bildirimli ve profesyonel yönetim panelli dijital şubeniz bugün hazır. Kurulum ücretsiz, kredi kartı gerekmez.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 md:gap-4 mb-10">
                            <Button size="lg" className="h-12 md:h-14 px-8 text-base md:text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all w-full sm:w-auto">
                                Ücretsiz Başla
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button variant="outline" size="lg" className="h-12 md:h-14 px-8 text-base md:text-lg font-bold border-2 w-full sm:w-auto hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
                                <PlayCircle className="mr-2 w-5 h-5" />
                                Yönetim Paneli
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

                    <div className="flex-1 relative w-full max-w-xl animate-float lg:ml-auto">
                        <div className="absolute inset-0 bg-primary/20 rounded-[3rem] blur-[80px] -z-10 scale-90" />

                        {/* Mobile Phone Mockup */}
                        <div className="relative mx-auto w-full max-w-[320px] aspect-[9/18.5] bg-zinc-900 rounded-[3rem] border-[8px] border-zinc-900 shadow-2xl overflow-hidden group ring-1 ring-white/10">
                            {/* Phone Header / Notch Area */}
                            <div className="absolute top-0 inset-x-0 h-6 bg-zinc-900 z-30 flex justify-center items-center">
                                <div className="w-16 h-4 bg-black rounded-b-xl" />
                            </div>

                            {/* UI Content (The actual interface) */}
                            <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-950 overflow-y-auto pt-6 pb-20 no-scrollbar">
                                {/* Top Banner/Logo Card */}
                                <div className="px-3 pt-4">
                                    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-4 relative overflow-hidden">
                                        <div className="flex gap-4 items-start mb-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg ring-4 ring-orange-500/10 shrink-0">
                                                DÖ
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-black text-xl text-zinc-900 dark:text-zinc-100">Dönerin Ustası</h3>
                                                <p className="text-xs text-zinc-500 font-medium">Kebap • Pide • Izgara</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">
                                                        <span className="text-[10px] text-amber-600 font-black">★ 4.8</span>
                                                        <span className="text-[9px] text-zinc-400 font-medium">(500+)</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                                        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Açık</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 border-t border-zinc-50 dark:border-zinc-800 pt-3">
                                            <div className="text-center border-r border-zinc-50 dark:border-zinc-800">
                                                <p className="text-lg font-black text-zinc-900 dark:text-zinc-100 leading-tight">150<span className="text-xs ml-0.5">₺</span></p>
                                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">MIN. SİPARİŞ</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-black text-zinc-900 dark:text-zinc-100 leading-tight">25<span className="text-xs ml-0.5 font-medium italic">dk</span></p>
                                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">TESLİMAT</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Category Tabs */}
                                <div className="mt-6 flex gap-2 px-3 overflow-x-auto no-scrollbar whitespace-nowrap">
                                    <div className="bg-primary text-white text-[11px] font-bold px-4 py-2.5 rounded-full shadow-lg shadow-primary/20">
                                        Dürüm & Ekmek Arası
                                    </div>
                                    <div className="bg-white dark:bg-zinc-900 text-zinc-500 text-[11px] font-bold px-4 py-2.5 rounded-full border border-zinc-100 dark:border-zinc-800">
                                        Porsiyon & İskender
                                    </div>
                                </div>

                                {/* Search Bar */}
                                <div className="mt-6 px-3">
                                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 flex items-center gap-2 group focus-within:ring-2 ring-primary/10 transition-all">
                                        <div className="w-4 h-4 text-zinc-400">🔍</div>
                                        <div className="h-4 w-1 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-1" />
                                        <span className="text-xs text-zinc-400 font-medium">Ürün ara...</span>
                                    </div>
                                </div>

                                {/* Product List Section */}
                                <div className="mt-8 px-3 pb-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-4 h-4 text-primary shrink-0 opacity-80">📱</div>
                                        <h4 className="font-black text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">Dürüm & Ekmek Arası</h4>
                                        <span className="bg-zinc-100 dark:bg-zinc-900 text-zinc-500 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">4</span>
                                    </div>

                                    {/* Product Card */}
                                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-2.5 flex gap-3 relative overflow-hidden hover:border-primary/20 transition-all group/card">
                                        <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-950 rounded-xl overflow-hidden relative shrink-0">
                                            <div className="absolute top-1 left-1 bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-full z-10 flex items-center gap-1">
                                                <span>🔥 POPÜLER</span>
                                            </div>
                                            <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 group-hover/card:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex flex-col justify-between py-1 flex-1">
                                            <div>
                                                <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 leading-snug">Et Döner Dürüm (100g)</h5>
                                                <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1">Özel sos ve lavaş eşliğinde...</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="font-black text-sm text-zinc-900 dark:text-zinc-100 italic">240.00 <span className="text-[10px] not-italic">₺</span></span>
                                                <button className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-black text-lg hover:bg-primary hover:text-white transition-all">+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sticky View Cart Button */}
                            <div className="absolute bottom-4 inset-x-3 h-12 bg-primary rounded-2xl shadow-[0_8px_30px_rgb(235,60,0,0.4)] flex items-center justify-between px-4 group/cart animate-in fade-in slide-in-from-bottom duration-500 delay-500">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-white text-primary rounded-full flex items-center justify-center text-xs font-black">1</div>
                                    <span className="text-[13px] font-black text-white uppercase tracking-tight group-hover:translate-x-1 transition-transform">Sepeti Görüntüle</span>
                                </div>
                                <div className="flex items-center gap-1.5 font-black text-white italic text-sm">
                                    240.00 ₺ <span className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">→</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating elements moved to match new frame */}
                        <div className="absolute -top-6 -right-6 md:-top-10 md:-right-10 bg-white dark:bg-zinc-950 p-4 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 animate-bounce-slow hidden sm:block z-40">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-full shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Yeni Sipariş</p>
                                    <p className="text-sm font-black text-zinc-900 dark:text-zinc-100">Et Döner Dürüm #42</p>
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Intro Text */}
                        <div className="absolute -bottom-10 -left-6 md:-bottom-20 md:-left-12 max-w-[200px] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 dark:border-zinc-800 animate-fade-in hidden lg:block">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                <span className="text-[10px] font-black text-primary uppercase tracking-wider">İşletmeniz Cebinizde</span>
                            </div>
                            <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 leading-tight">
                                Günlük ciro, paket sayısı ve mağaza trafiğini anlık grafiklerle takip edin.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
