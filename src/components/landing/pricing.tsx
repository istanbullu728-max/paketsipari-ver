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
        <section id="pricing" className="py-32 md:py-48 bg-white dark:bg-zinc-950">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-4xl mx-auto mb-20 md:mb-32">
                    <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-6">FİYATLANDIRMA</h2>
                    <h3 className="text-5xl md:text-8xl font-black text-zinc-900 dark:text-zinc-100 leading-[0.95] tracking-tighter mb-10">
                        Basit ve Şeffaf. <br />
                        <span className="text-zinc-400 italic">Sürpriz Yok.</span>
                    </h3>

                    <div className="inline-flex items-center p-2 bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800">
                        <button
                            onClick={() => setBillingCycle("monthly")}
                            className={cn(
                                "px-8 py-3 text-xs font-black uppercase tracking-widest rounded-[1.5rem] transition-all",
                                billingCycle === "monthly" ? "bg-white dark:bg-zinc-800 shadow-xl text-primary" : "text-zinc-500"
                            )}
                        >
                            Aylık
                        </button>
                        <button
                            onClick={() => setBillingCycle("yearly")}
                            className={cn(
                                "px-8 py-3 text-xs font-black uppercase tracking-widest rounded-[1.5rem] transition-all relative",
                                billingCycle === "yearly" ? "bg-white dark:bg-zinc-800 shadow-xl text-primary" : "text-zinc-500"
                            )}
                        >
                            Yıllık
                            <span className="absolute -top-10 -right-4 px-3 py-1 bg-emerald-500 text-[10px] text-white rounded-full font-black animate-bounce shadow-lg shadow-emerald-500/20 lowercase tracking-tight">
                                tasarruf %30
                            </span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "relative p-10 rounded-[3.5rem] border transition-all duration-500 hover:-translate-y-2",
                                plan.popular
                                    ? "bg-zinc-900 dark:bg-zinc-900 text-white border-primary shadow-[0_32px_64px_rgba(0,0,0,0.2)] md:p-14 md:scale-105 z-10"
                                    : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-10 -translate-y-1/2 bg-primary text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl shadow-primary/20">
                                    EN POPÜLER SEÇİM
                                </div>
                            )}

                            <div className="mb-10">
                                <h4 className="text-3xl font-black tracking-tighter mb-2 italic">{plan.name}</h4>
                                <p className={cn("text-sm font-medium", plan.popular ? "text-zinc-400" : "text-zinc-500")}>{plan.desc}</p>
                            </div>

                            <div className="flex items-baseline gap-2 mb-10">
                                <span className="text-6xl md:text-7xl font-black tracking-tighter italic">₺{plan.price[billingCycle]}</span>
                                <span className={cn("text-sm font-bold uppercase tracking-widest", plan.popular ? "text-zinc-500" : "text-zinc-400")}>/ {billingCycle === "monthly" ? "ay" : "ay"}</span>
                            </div>

                            <div className="space-y-6 mb-12 border-t border-b py-10 border-zinc-100 dark:border-zinc-800">
                                {plan.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-center gap-4">
                                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0", plan.popular ? "bg-white/10" : "bg-emerald-500/10")}>
                                            <Check className={cn("w-3 h-3", plan.popular ? "text-white" : "text-emerald-500")} />
                                        </div>
                                        <span className={cn("text-[13px] font-black uppercase tracking-tight", plan.popular ? "text-zinc-300" : "text-zinc-600")}>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant={plan.popular ? "default" : "outline"}
                                className={cn(
                                    "w-full h-16 text-lg font-black rounded-2xl transition-all uppercase tracking-widest", 
                                    plan.popular ? "bg-primary hover:bg-white hover:text-primary" : "border-2"
                                )}
                            >
                                Planı Seç
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                            <Info className="w-5 h-5 text-zinc-500" />
                        </div>
                        <p className="text-sm font-bold text-zinc-500 leading-relaxed">
                            <span className="text-zinc-900 dark:text-zinc-100 italic">Gizli Ücret Yok.</span> Sipariş başına komisyon ödemezsiniz. Sadece aylık sabit paket ücretinizi bilirsiniz.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                            <Check className="w-5 h-5 text-zinc-500" />
                        </div>
                        <p className="text-sm font-bold text-zinc-500 leading-relaxed">
                            <span className="text-zinc-900 dark:text-zinc-100 italic">14 Gün Ücretsiz.</span> Tüm planlarda ücretsiz deneme mevcuttur. Taahhüt vermeden hemen kullanmaya başlayın.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
