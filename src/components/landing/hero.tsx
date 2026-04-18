"use client";

import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-56 md:pb-40 overflow-hidden bg-white dark:bg-zinc-950">
            {/* Mesh Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none overflow-hidden blur-[120px] opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/20 rounded-full" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    <div className="flex-1 max-w-3xl text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl text-zinc-900 dark:text-zinc-100 text-[11px] font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            YENİ NESİL PAKET SİPARİŞ SİSTEMİ
                        </div>

                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 leading-[0.95] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                            Aracıya Değil, <br />
                            <span className="text-primary italic">İşine Yatırım Yap.</span>
                        </h1>

                        <p className="text-lg md:text-2xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-tight font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                            Komisyonsuz, WhatsApp entegrasyonlu ve profesyonel yönetim panelli dijital şubeniz dakikalar içinde hazır. Kontrol tamamen sizde.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                            <Button size="lg" className="h-16 px-10 text-lg font-black rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all w-full sm:w-auto bg-primary hover:bg-primary/90 text-white border-0">
                                Ücretsiz Dene
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button variant="outline" size="lg" className="h-16 px-10 text-lg font-black rounded-2xl border-2 w-full sm:w-auto hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all border-zinc-200 dark:border-zinc-800">
                                <PlayCircle className="mr-2 w-5 h-5" />
                                Demoyu Gör
                            </Button>
                        </div>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-xs font-bold text-zinc-500 uppercase tracking-widest animate-in fade-in duration-1000 delay-700">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                </div>
                                <span>Kurulum Ücretsiz</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                </div>
                                <span>Kredi Kartı Gerekmez</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                </div>
                                <span>Sınırsız Ürün</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 relative w-full max-w-2xl animate-in fade-in zoom-in duration-1000 delay-500">
                        <div className="absolute inset-0 bg-primary/20 rounded-[3rem] blur-[120px] -z-10 scale-90 opacity-50" />

                        {/* Professional Phone Frame */}
                        <div className="relative mx-auto w-full max-w-[340px] aspect-[9/19] bg-zinc-950 rounded-[3.5rem] p-3 border-[12px] border-zinc-900 shadow-[0_0_80px_rgba(0,0,0,0.2)] ring-1 ring-white/10 overflow-hidden transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
                            {/* Inner Screen */}
                            <div className="w-full h-full bg-zinc-50 dark:bg-zinc-950 rounded-[2.5rem] overflow-y-auto no-scrollbar relative">
                                {/* Dynamic Island / Notch */}
                                <div className="absolute top-0 inset-x-0 h-8 flex justify-center items-start pt-2 z-50">
                                    <div className="w-24 h-6 bg-black rounded-full" />
                                </div>

                                {/* Content Example */}
                                <div className="p-4 pt-10 pb-20 space-y-6">
                                    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800">
                                        <div className="flex gap-4 mb-4">
                                            <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">DÖ</div>
                                            <div>
                                                <h3 className="font-black text-lg">Dönerci Yusuf</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold uppercase">Açık</span>
                                                    <span className="text-[10px] text-zinc-400 font-bold">4.9 (1k+)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 border-t pt-4">
                                            <div className="text-center">
                                                <div className="text-xs font-black italic">150₺</div>
                                                <div className="text-[8px] text-zinc-400 font-bold uppercase tracking-tighter">Min. Paket</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs font-black italic">20-30dk</div>
                                                <div className="text-[8px] text-zinc-400 font-bold uppercase tracking-tighter">Teslimat</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">🔥 En Çok Tercih Edilenler</h4>
                                        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3 flex gap-3 border border-zinc-100 dark:border-zinc-800">
                                            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-950 rounded-xl shrink-0" />
                                            <div className="flex flex-col justify-between flex-1 py-1">
                                                <div className="font-black text-xs">Gurme Tavuk Dürüm</div>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-black text-sm italic text-primary">180₺</span>
                                                    <button className="w-6 h-6 bg-primary text-white rounded-lg font-black text-lg flex items-center justify-center">+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Cart Button */}
                                <div className="absolute bottom-4 inset-x-4 h-14 bg-primary rounded-2xl flex items-center justify-between px-5 shadow-2xl shadow-primary/40 animate-bounce-slow">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-white text-primary rounded-full flex items-center justify-center text-[10px] font-black">2</div>
                                        <span className="text-white font-black text-sm uppercase tracking-tight">Sepeti Gör</span>
                                    </div>
                                    <span className="text-white font-black italic">360.00 ₺</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating Admin Alert Card */}
                        <div className="absolute top-1/4 -right-12 bg-white dark:bg-zinc-950 p-4 rounded-3xl shadow-2xl border border-zinc-100 dark:border-zinc-800 animate-float hidden md:block">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Yeni Sipariş</div>
                                    <div className="text-base font-black text-zinc-900 dark:text-zinc-100">#42 • 214.00 ₺</div>
                                </div>
                            </div>
                        </div>

                        {/* Revenue Card */}
                        <div className="absolute bottom-10 -left-16 bg-white dark:bg-zinc-950 p-5 rounded-3xl shadow-2xl border border-zinc-100 dark:border-zinc-800 animate-float-slow hidden lg:block">
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-2">Günlük Ciro</div>
                                    <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">12.450,00 ₺</div>
                                </div>
                                <div className="flex gap-1 items-end h-8">
                                    {[30, 50, 40, 70, 90, 60, 80].map((h, i) => (
                                        <div key={i} className="flex-1 bg-primary/20 rounded-t-sm" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
