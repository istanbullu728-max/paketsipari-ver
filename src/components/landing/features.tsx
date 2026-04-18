"use client";

import { Smartphone, MessageSquare, BarChart3, ScanQrCode, Zap, Clock } from "lucide-react";

const features = [
    {
        icon: <Zap className="w-6 h-6" />,
        title: "%0 Komisyon (Net Kazanç)",
        desc: "Yemek platformlarına %30-40 komisyon vermeyin. Kazancınızın %100'ü doğrudan sizin cebinizde kalsın.",
        color: "bg-emerald-500"
    },
    {
        icon: <Clock className="w-6 h-6" />,
        title: "Akıllı Sipariş Takibi (Zil Sesi)",
        desc: "Sipariş geldiğinde panelinizde yüksek sesli zil çalar. Yoğun mutfak ortamında bile hiçbir siparişi kaçırmazsınız.",
        color: "bg-primary"
    },
    {
        icon: <MessageSquare className="w-6 h-6" />,
        title: "Tek Tıkla WhatsApp Onay",
        desc: "Siparişi onayladığınız an müşteriye otomatik olarak 'Hazırlanıyor' veya 'Yola Çıktı' şablon mesajı gönderilir.",
        color: "bg-blue-500"
    },
    {
        icon: <BarChart3 className="w-6 h-6" />,
        title: "Müşteri Rehberi & Sadakat",
        desc: "Sipariş veren her müşteri otomatik olarak listenize eklenir. Kendi müşteri datanızı oluşturun ve özel kampanyalar yapın.",
        color: "bg-purple-500"
    },
    {
        icon: <ScanQrCode className="w-6 h-6" />,
        title: "QR Menü & Dijital Şube",
        desc: "Müşterileriniz QR kodu okutsun, tüm menünüzü şık bir arayüzle görsün ve anında sipariş versin.",
        color: "bg-amber-500"
    },
    {
        icon: <Smartphone className="w-6 h-6" />,
        title: "Kusursuz Mobil Deneyim",
        desc: "Uygulama indirmeden, tarayıcı üzerinden çalışan hızlı ve profesyonel sipariş sitesi.",
        color: "bg-zinc-900"
    }
];

export function Features() {
    return (
        <section id="features" className="py-32 md:py-48 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mb-24">
                    <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-6">NEDEN PAKETSERVİS?</h2>
                    <h3 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-zinc-100 leading-[0.95] tracking-tight">
                        İşinizi Büyütmek İçin <br />
                        <span className="text-zinc-400">İhtiyacınız Olan Her Şey.</span>
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[240px] md:auto-rows-[300px]">
                    {/* Feature 1: Big Card */}
                    <div className="md:col-span-8 md:row-span-2 group relative bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-2xl transition-all duration-500">
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-primary/20">
                                    <Zap className="w-8 h-8" />
                                </div>
                                <h4 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 mb-4 tracking-tighter">%0 Komisyon, %100 Kazanç</h4>
                                <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-md leading-snug font-medium">
                                    Yemek platformlarının kestiği %30-40 arası komisyonları unutun. Kazancınızın her kuruşu saniyeler içinde doğrudan size kalsın.
                                </p>
                            </div>
                            <div className="mt-8 flex gap-4">
                                <div className="bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest">Yıllık 120.000 TL Tasarruf*</div>
                            </div>
                        </div>
                        {/* Abstract visual */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
                    </div>

                    {/* Feature 2: Small Card */}
                    <div className="md:col-span-4 md:row-span-1 group bg-zinc-900 text-white rounded-[3rem] p-8 overflow-hidden hover:scale-[1.02] transition-transform">
                        <div className="h-full flex flex-col justify-between">
                            <Clock className="w-8 h-8 text-primary" />
                            <div>
                                <h4 className="text-2xl font-black tracking-tight mb-2">Akıllı Zil Sesi</h4>
                                <p className="text-sm text-zinc-400 font-medium leading-relaxed">Sipariş geldiğinde yüksek sesli uyarı ile hiçbir paket kaçmaz.</p>
                            </div>
                        </div>
                    </div>

                   {/* Feature 3: Small Card */}
                    <div className="md:col-span-4 md:row-span-1 group bg-white dark:bg-zinc-900 rounded-[3rem] p-8 border border-zinc-200 dark:border-zinc-800 hover:border-primary/20 transition-all">
                        <div className="h-full flex flex-col justify-between">
                            <MessageSquare className="w-8 h-8 text-blue-500" />
                            <div>
                                <h4 className="text-2xl font-black tracking-tight mb-2">WhatsApp Onay</h4>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Müşteriye otomatik durum güncellemeleri gönderin.</p>
                            </div>
                        </div>
                    </div>

                    {/* Feature 4: Medium Card */}
                    <div className="md:col-span-4 md:row-span-1 group bg-zinc-100 dark:bg-zinc-800 rounded-[3rem] p-8 overflow-hidden">
                        <div className="h-full flex flex-col justify-between">
                            <ScanQrCode className="w-8 h-8 text-amber-500" />
                            <div>
                                <h4 className="text-2xl font-black tracking-tight mb-2">Sınırsız QR Menü</h4>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Müşterileriniz masadan veya evden anında sipariş versin.</p>
                            </div>
                        </div>
                    </div>

                    {/* Feature 5: Medium Card */}
                    <div className="md:col-span-4 md:row-span-1 group bg-white dark:bg-zinc-900 rounded-[3rem] p-8 border border-zinc-200 dark:border-zinc-800">
                        <div className="h-full flex flex-col justify-between">
                            <BarChart3 className="w-8 h-8 text-purple-500" />
                            <div>
                                <h4 className="text-2xl font-black tracking-tight mb-2">Müşteri Rehberi</h4>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Kendi dijital müşteri veritabanınızı saniyeler içinde oluşturun.</p>
                            </div>
                        </div>
                    </div>

                    {/* Feature 6: Medium Card */}
                    <div className="md:col-span-4 md:row-span-1 group bg-primary text-white rounded-[3rem] p-8 overflow-hidden shadow-2xl shadow-primary/20">
                        <div className="h-full flex flex-col justify-between">
                            <Smartphone className="w-8 h-8" />
                            <div>
                                <h4 className="text-2xl font-black tracking-tight mb-2">Native App Hissiyatı</h4>
                                <p className="text-sm text-white/80 font-medium leading-relaxed">Tarayıcı üzerinden uygulama kalitesinde sipariş deneyimi.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
