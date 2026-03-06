"use client";

import { Smartphone, MessageSquare, BarChart3, ScanQrCode, Zap, Clock } from "lucide-react";

const features = [
    {
        icon: <Smartphone className="w-6 h-6" />,
        title: "Dijital Menü & QR",
        desc: "Basılı menülerle uğraşmayın. Müşterileriniz QR kodunu okutsun, tüm menünüzü şık bir arayüzle görsün.",
        color: "bg-blue-500"
    },
    {
        icon: <MessageSquare className="w-6 h-6" />,
        title: "WhatsApp Sipariş",
        desc: "Siparişler doğrudan WhatsApp'ınıza düşer. Aracı olmadan, komisyonsuz ve hızlı iletişim sağlayın.",
        color: "bg-emerald-500"
    },
    {
        icon: <BarChart3 className="w-6 h-6" />,
        title: "Akıllı Analizler",
        desc: "En çok satanları görün, müşteri alışkanlıklarını analiz edin ve kazancınızı verilerle artırın.",
        color: "bg-primary"
    },
    {
        icon: <ScanQrCode className="w-6 h-6" />,
        title: "Hızlı Kurulum",
        desc: "Karmaşık teknik süreçler yok. Restoran bilgilerinizi girin, ürünlerinizi yükleyin ve anında başlayın.",
        color: "bg-amber-500"
    },
    {
        icon: <Zap className="w-6 h-6" />,
        title: "Sıfır Komisyon",
        desc: "Uygulama içi satışlardan komisyon almayız. Kazancınızın %100'ü sizin cebinizde kalsın.",
        color: "bg-purple-500"
    },
    {
        icon: <Clock className="w-6 h-6" />,
        title: "7/24 Erişim",
        desc: "Sisteminiz her an aktif. Siz uyurken bile müşterileriniz menünüzü inceleyebilir.",
        color: "bg-red-500"
    }
];

export function Features() {
    return (
        <section id="features" className="py-24 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
                    <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">ÖZELLİKLER</h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">İşletmenizi Büyütecek Profesyonel Çözümler</h3>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400">Geleneksel paket servis yöntemlerini geride bırakın. Modern, hızlı ve tamamen size özel bir sisteme geçiş yapın.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className={`w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                {feature.icon}
                            </div>
                            <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 group-hover:text-primary transition-colors">{feature.title}</h4>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
