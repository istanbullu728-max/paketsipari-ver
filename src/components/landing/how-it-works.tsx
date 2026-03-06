"use client";

import { UserCircle, ListPlus, Send } from "lucide-react";

const steps = [
    {
        icon: <UserCircle className="w-10 h-10" />,
        title: "1. Kayıt Ol",
        desc: "Adınızı ve e-postanızı girerek 30 saniye içinde ücretsiz hesabınızı oluşturun."
    },
    {
        icon: <ListPlus className="w-10 h-10" />,
        title: "2. Menünü Ekle",
        desc: "Ürünlerinizi, fotoğraflarınızı ve fiyatlarınızı kolayca yönetim panelinden yükleyin."
    },
    {
        icon: <Send className="w-10 h-10" />,
        title: "3. Sipariş Al",
        desc: "QR kodunuzu masalara veya broşürlere ekleyin, siparişleri almaya başlayın."
    }
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 md:py-32 bg-zinc-900 text-white overflow-hidden relative">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] -z-0" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
                    <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">SÜREÇ</h2>
                    <h3 className="text-3xl md:text-5xl font-bold mb-6">Dakikalar İçerisinde Hazır Olun</h3>
                    <p className="text-lg text-white/60">Teknoloji bilginiz ne olursa olsun, Paketservis ile mağazanızı dijitale taşımak çocuk oyuncağı.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-[2.5rem] left-[15%] right-[15%] h-px border-t-2 border-dashed border-white/10 -z-0" />

                    {steps.map((step, idx) => (
                        <div key={idx} className="relative z-10 text-center flex flex-col items-center group">
                            <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                {step.icon}
                            </div>
                            <h4 className="text-2xl font-bold mb-4">{step.title}</h4>
                            <p className="text-white/60 leading-relaxed max-w-xs">{step.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <div className="inline-block p-1 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-900 border border-white/10 p-6 rounded-xl">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`w-12 h-12 rounded-full border-4 border-zinc-900 bg-zinc-700 overflow-hidden`}>
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="avatar" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-medium">Toplam <span className="text-emerald-400">+2500 sipariş</span> bugün başarıyla tamamlandı.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
