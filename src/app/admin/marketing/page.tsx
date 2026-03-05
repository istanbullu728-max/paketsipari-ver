"use client";

import { useState, useRef } from "react";
import { useRestaurant } from "@/components/restaurant-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Download,
    Sticker,
    BookOpen,
    Gift,
    QrCode,
    Printer,
} from "lucide-react";

type TemplateId = "sticker" | "brochure" | "giftcard";

const TEMPLATES = [
    {
        id: "sticker" as TemplateId,
        icon: Sticker,
        label: "Sticker",
        desc: "Paket torbalarına yapıştırın",
        size: "8×8 cm",
    },
    {
        id: "brochure" as TemplateId,
        icon: BookOpen,
        label: "Broşür",
        desc: "Kapılara bırakın, masalara koyun",
        size: "A5",
    },
    {
        id: "giftcard" as TemplateId,
        icon: Gift,
        label: "Hediye Kartı",
        desc: "Sadık müşterilere gönderin",
        size: "Kredi kartı",
    },
];

/* ── Utility ─────────────────────────────────────────────────────────── */
const printArea = () => {
    const el = document.getElementById("marketing-print-area");
    if (!el) return;
    const html = `
        <html><head><style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
            body{margin:0;background:#fff;font-family:'Inter',sans-serif;}
            ${el.getAttribute("data-print-css") || ""}
        </style></head>
        <body>${el.innerHTML}</body></html>`;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 600);
};

/* ══════════════════════════════════════════════════════════════════════ */
/*  S T I C K E R                                                        */
/* ══════════════════════════════════════════════════════════════════════ */
function StickerDesign({ restaurant, discount, tagline }: { restaurant: any; discount: string; tagline: string }) {
    return (
        <div style={{
            width: 280, height: 280,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#064e3b 0%,#065f46 60%,#059669 100%)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 0 12px #d1fae5, 0 0 0 16px #6ee7b7",
            padding: 20,
            textAlign: "center",
            fontFamily: "'Inter',sans-serif",
        }}>
            {restaurant.logoUrl && (
                <img src={restaurant.logoUrl} alt="Logo"
                    style={{ width: 56, height: 56, objectFit: "contain", borderRadius: "50%", marginBottom: 8, background: "#fff", padding: 4 }} />
            )}
            {!restaurant.logoUrl && (
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 24, color: "#059669", marginBottom: 8 }}>
                    {restaurant.name.charAt(0)}
                </div>
            )}
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 18, letterSpacing: -0.5 }}>{restaurant.name}</div>
            {discount && (
                <div style={{ marginTop: 6, background: "#fbbf24", color: "#1c1917", fontWeight: 900, fontSize: 22, borderRadius: 8, padding: "4px 14px" }}>
                    %{discount} İNDİRİM
                </div>
            )}
            <div style={{ color: "#6ee7b7", fontSize: 11, marginTop: 8, fontWeight: 600 }}>
                {tagline || `Online sipariş: /${restaurant.slug}`}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  B R O Ş Ü R                                                          */
/* ══════════════════════════════════════════════════════════════════════ */
function BrochureDesign({ restaurant, discount, tagline, extraText }: { restaurant: any; discount: string; tagline: string; extraText: string }) {
    return (
        <div style={{ width: 340, fontFamily: "'Inter',sans-serif", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,.15)" }}>
            {/* Header stripe */}
            <div style={{ background: "linear-gradient(120deg,#064e3b,#059669)", padding: "28px 24px 20px", textAlign: "center" }}>
                {restaurant.logoUrl && (
                    <img src={restaurant.logoUrl} alt="Logo"
                        style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "contain", background: "#fff", padding: 6, marginBottom: 10 }} />
                )}
                {!restaurant.logoUrl && (
                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 28, color: "#059669", marginBottom: 10 }}>
                        {restaurant.name.charAt(0)}
                    </div>
                )}
                <div style={{ color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: -0.5, display: "block" }}>{restaurant.name}</div>
                <div style={{ color: "#6ee7b7", fontSize: 12, marginTop: 4 }}>Lezzetin adresi</div>
            </div>

            {/* Discount ribbon */}
            {discount && (
                <div style={{ background: "#fbbf24", padding: "12px 24px", textAlign: "center" }}>
                    <span style={{ fontWeight: 900, fontSize: 20, color: "#1c1917" }}>🎉 Online Siparişlerde %{discount} İndirim!</span>
                </div>
            )}

            {/* Body */}
            <div style={{ background: "#fff", padding: "20px 24px" }}>
                <div style={{ color: "#374151", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                    {tagline || "Lezzetli yemeklerimizi artık online sipariş vererek kapınıza kadar getiriyoruz."}
                </div>
                {extraText && (
                    <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", color: "#065f46", fontSize: 13, marginBottom: 16 }}>
                        {extraText}
                    </div>
                )}
                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 14, fontSize: 12, color: "#6b7280" }}>
                    <div>💬 WhatsApp: {restaurant.whatsappNumber || "—"}</div>
                    <div style={{ marginTop: 4 }}>🌐 Online Sipariş: paketservis.com/{restaurant.slug}</div>
                </div>
            </div>

            {/* Footer */}
            <div style={{ background: "#064e3b", padding: "10px 24px", textAlign: "center" }}>
                <span style={{ color: "#6ee7b7", fontSize: 11, fontWeight: 600 }}>Sizi bekliyoruz! Afiyet olsun 🍽️</span>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  H E D İ Y E  K A R T I                                              */
/* ══════════════════════════════════════════════════════════════════════ */
function GiftCardDesign({ restaurant, discount, tagline }: { restaurant: any; discount: string; tagline: string }) {
    return (
        <div style={{
            width: 340, height: 200,
            background: "linear-gradient(135deg,#1c1917 0%,#292524 60%,#44403c 100%)",
            borderRadius: 18,
            padding: "24px 28px",
            fontFamily: "'Inter',sans-serif",
            boxShadow: "0 8px 32px rgba(0,0,0,.3)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
        }}>
            {/* Decorative circle */}
            <div style={{ position: "absolute", right: -30, top: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(5,150,105,.2)" }} />
            <div style={{ position: "absolute", right: 20, bottom: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(251,191,36,.1)" }} />

            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    {restaurant.logoUrl ? (
                        <img src={restaurant.logoUrl} alt="logo" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "contain", background: "#fff", padding: 3 }} />
                    ) : (
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#059669", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16, color: "#fff" }}>
                            {restaurant.name.charAt(0)}
                        </div>
                    )}
                </div>
                <div style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Hediye Kartı</div>
            </div>

            {/* Center value */}
            <div style={{ textAlign: "center" }}>
                {discount ? (
                    <div style={{ color: "#fff", fontWeight: 900, fontSize: 36, letterSpacing: -1 }}>
                        %<span style={{ color: "#fbbf24" }}>{discount}</span>
                        <span style={{ fontSize: 16, fontWeight: 600, marginLeft: 6, color: "#a8a29e" }}>İndirim</span>
                    </div>
                ) : (
                    <div style={{ color: "#fbbf24", fontWeight: 900, fontSize: 28 }}>🎁 Sürpriz</div>
                )}
                <div style={{ color: "#a8a29e", fontSize: 11, marginTop: 4 }}>{tagline || "Lezzetle dolu bir deneyim"}</div>
            </div>

            {/* Bottom */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div style={{ color: "#78716c", fontSize: 11 }}>paketservis.com/{restaurant.slug}</div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{restaurant.name}</div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  M A I N  P A G E                                                     */
/* ══════════════════════════════════════════════════════════════════════ */
export default function AdminMarketingPage() {
    const { restaurantData } = useRestaurant();
    const [active, setActive] = useState<TemplateId>("sticker");
    const [discount, setDiscount] = useState("10");
    const [tagline, setTagline] = useState("");
    const [extraText, setExtraText] = useState("");

    const handlePrint = () => printArea();

    const previewNode =
        active === "sticker" ? <StickerDesign restaurant={restaurantData} discount={discount} tagline={tagline} /> :
            active === "brochure" ? <BrochureDesign restaurant={restaurantData} discount={discount} tagline={tagline} extraText={extraText} /> :
                <GiftCardDesign restaurant={restaurantData} discount={discount} tagline={tagline} />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight dark:text-zinc-100">Pazarlama Araçları</h1>
                    <p className="text-zinc-500 mt-1">Tasarım bilgisi olmadan profesyonel baskı materyalleri oluşturun.</p>
                </div>
                <Button onClick={handlePrint} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-md">
                    <Printer className="w-4 h-4" />
                    PDF Olarak İndir
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

                {/* ── Left panel: template picker + options ───────────────── */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Template selector */}
                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-3">
                        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Malzeme Türü</p>
                        {TEMPLATES.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActive(t.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${active === t.id
                                    ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/30"
                                    : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${active === t.id ? "bg-emerald-100 dark:bg-emerald-500/20" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                                    <t.icon className={`w-5 h-5 ${active === t.id ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500"}`} />
                                </div>
                                <div>
                                    <div className={`font-semibold text-sm ${active === t.id ? "text-emerald-700 dark:text-emerald-400" : "text-zinc-700 dark:text-zinc-300"}`}>{t.label}</div>
                                    <div className="text-xs text-zinc-400">{t.desc} · {t.size}</div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Options */}
                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-4">
                        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">İçerik Ayarları</p>

                        <div className="space-y-1.5">
                            <Label className="text-xs">İndirim Oranı (%)</Label>
                            <Input
                                type="number" min={0} max={100}
                                value={discount}
                                onChange={e => setDiscount(e.target.value)}
                                placeholder="Örn: 10"
                                className="h-9"
                            />
                            <p className="text-[11px] text-zinc-400">Boş bırakırsanız indirim alanı gizlenir.</p>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Slogan / Alt Mesaj</Label>
                            <Input
                                value={tagline}
                                onChange={e => setTagline(e.target.value)}
                                placeholder={`Online sipariş: /${restaurantData.slug}`}
                                className="h-9"
                            />
                        </div>

                        {active === "brochure" && (
                            <div className="space-y-1.5">
                                <Label className="text-xs">Kampanya Metni (isteğe bağlı)</Label>
                                <Textarea
                                    value={extraText}
                                    onChange={e => setExtraText(e.target.value)}
                                    placeholder="Örn: Her Cuma indirimli menülerimizi kaçırmayın!"
                                    className="resize-none h-20 text-sm"
                                />
                            </div>
                        )}

                        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                            <div>• Restoran adı ve logo otomatik ekleniyor</div>
                            <div>• Logo değiştirmek için Ayarlar → Logo Yükle</div>
                            <div>• Yazdır diyince "PDF Olarak Kaydet" seçin</div>
                        </div>
                    </div>
                </div>

                {/* ── Right panel: live preview ────────────────────────────── */}
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Canlı Önizleme</p>
                            <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
                                {TEMPLATES.find(t => t.id === active)?.size}
                            </span>
                        </div>

                        {/* Checkerboard preview bg */}
                        <div
                            className="flex items-center justify-center rounded-xl min-h-72 p-6"
                            style={{ background: "repeating-conic-gradient(#e5e7eb 0% 25%, #f9fafb 0% 50%) 0 0 / 20px 20px" }}
                        >
                            {previewNode}
                        </div>

                        <p className="text-xs text-zinc-400 text-center">
                            Tasarım gerçek ölçekte baskıya hazır. PDF İndir butonuna basın.
                        </p>

                        <Button onClick={handlePrint} variant="outline" className="w-full gap-2">
                            <Download className="w-4 h-4" />
                            PDF Olarak İndir / Yazdır
                        </Button>
                    </div>
                </div>
            </div>

            {/* Hidden print area — cloned by printArea() */}
            <div
                id="marketing-print-area"
                className="hidden"
                data-print-css={`
                    body { display:flex; align-items:center; justify-content:center; min-height:100vh; background:#f3f4f6; }
                    img { max-width:100%; }
                `}
            >
                <div style={{ padding: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {previewNode}
                </div>
            </div>
        </div>
    );
}
