"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Başlangıç",
        price: { monthly: "800", yearly: "560" },
        desc: "Küçük ölçekli işletmeler için ideal.",
        features: ["50 Ürün Sınırı", "QR Menü", "WhatsApp Sipariş", "Temel Analitik"],
        popular: false
    },
    {
        name: "Profesyonel",
        price: { monthly: "900", yearly: "630" },
        desc: "Büyüyen restoranlar için en iyi seçenek.",
        features: ["Sınırsız Ürün", "Gelişmiş Analitik", "Müşteri Yönetimi", "Öncelikli Destek", "Özel QR Tasarımı"],
        popular: true
    },
    {
        name: "Enterprise",
        price: { monthly: "1200", yearly: "840" },
        desc: "Büyük zincir restoranlar için tam kontrol.",
        features: ["Çoklu Şube Yönetimi", "API Erişimi", "7/24 Özel Danışman", "White-label Kullanım", "Özel Entegrasyonlar"],
        popular: false
    }
];

export function Pricing() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

    return (
        <section id="pricing" className="py-24 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">FİYATLANDIRMA</h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Size Uygun Planı Seçin</h3>

                    <div className="inline-flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800">
                        <button
                            onClick={() => setBillingCycle("monthly")}
                            className={cn(
                                "px-6 py-2 text-sm font-bold rounded-full transition-all",
                                billingCycle === "monthly" ? "bg-white dark:bg-zinc-800 shadow-md text-primary" : "text-zinc-500"
                            )}
                        >
                            Aylık
                        </button>
                        <button
                            onClick={() => setBillingCycle("yearly")}
                            className={cn(
                                "px-6 py-2 text-sm font-bold rounded-full transition-all relative",
                                billingCycle === "yearly" ? "bg-white dark:bg-zinc-800 shadow-md text-primary" : "text-zinc-500"
                            )}
                        >
                            Yıllık
                            <span className="absolute -top-6 -right-2 px-2 py-0.5 bg-emerald-500 text-[10px] text-white rounded-full font-black animate-bounce">
                                -%30
                            </span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "relative p-8 rounded-3xl border transition-all duration-300",
                                plan.popular
                                    ? "bg-white dark:bg-zinc-950 border-primary shadow-2xl shadow-primary/10 scale-105 z-10 ring-4 ring-primary/5"
                                    : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-zinc-200"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                    EN POPÜLER
                                </div>
                            )}

                            <div className="mb-8">
                                <h4 className="text-2xl font-bold mb-2">{plan.name}</h4>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm">{plan.desc}</p>
                            </div>

                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl md:text-5xl font-black italic">₺{plan.price[billingCycle]}</span>
                                <span className="text-zinc-500 font-medium">/{billingCycle === "monthly" ? "ay" : "ay"}</span>
                            </div>

                            <div className="space-y-4 mb-8">
                                {plan.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant={plan.popular ? "default" : "outline"}
                                className={cn("w-full h-12 text-base font-bold transition-all", plan.popular ? "shadow-lg" : "")}
                            >
                                Hemen Başla
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center text-zinc-500 text-sm flex items-center justify-center gap-2">
                    <Info className="w-4 h-4" />
                    <span>Tüm planlarda ilk 14 gün ücretsiz deneme mevcuttur. Taahhüt yok.</span>
                </div>
            </div>
        </section>
    );
}
