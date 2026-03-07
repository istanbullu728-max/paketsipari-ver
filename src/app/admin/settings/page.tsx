"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRestaurant } from "@/components/restaurant-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, Upload, X, Image as ImageIcon, MessageCircle } from "lucide-react";

export default function AdminSettingsPage() {
    const { restaurantData, updateRestaurantData } = useRestaurant();
    const [formData, setFormData] = useState({
        name: restaurantData.name,
        whatsappNumber: restaurantData.whatsappNumber,
        minOrderAmount: restaurantData.minOrderAmount.toString(),
        openTime: restaurantData.businessHours.open,
        closeTime: restaurantData.businessHours.close,
        slug: restaurantData.slug,
        logoUrl: restaurantData.logoUrl || "",
    });
    const [saved, setSaved] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setFormData({
            name: restaurantData.name,
            whatsappNumber: restaurantData.whatsappNumber,
            minOrderAmount: restaurantData.minOrderAmount.toString(),
            openTime: restaurantData.businessHours.open,
            closeTime: restaurantData.businessHours.close,
            slug: restaurantData.slug,
            logoUrl: restaurantData.logoUrl || "",
        });
    }, [restaurantData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // ── Logo upload helpers ──────────────────────────────────────────────
    const readFile = (file: File): Promise<string> =>
        new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result as string);
            r.onerror = rej;
            r.readAsDataURL(file);
        });

    const handleLogoFile = useCallback(async (file: File) => {
        if (!file.type.startsWith("image/")) return;
        const dataUrl = await readFile(file);
        setFormData(prev => ({ ...prev, logoUrl: dataUrl }));
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleLogoFile(file);
    }, [handleLogoFile]);

    // ── Save ─────────────────────────────────────────────────────────────
    const handleSave = () => {
        updateRestaurantData({
            name: formData.name,
            whatsappNumber: formData.whatsappNumber,
            minOrderAmount: parseFloat(formData.minOrderAmount) || 0,
            slug: formData.slug,
            logoUrl: formData.logoUrl,
            businessHours: {
                ...restaurantData.businessHours,
                open: formData.openTime,
                close: formData.closeTime,
            }
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-24">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold dark:text-zinc-100">Restoran Ayarları</h1>
                <Button
                    onClick={handleSave}
                    className={`gap-2 shadow-md hidden md:flex transition-all ${saved ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                >
                    <Save className="w-4 h-4" />
                    {saved ? "Kaydedildi ✓" : "Kaydet"}
                </Button>
            </div>

            {/* ── Logo Card ──────────────────────────────────────────────────── */}
            <Card className="dark:border-zinc-800 dark:bg-zinc-950">
                <CardHeader>
                    <CardTitle>Restoran Logosu</CardTitle>
                    <CardDescription>
                        Logo hem yönetim panelinde hem de müşteri sipariş sayfasında görünür.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoFile(f); }}
                    />

                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        {/* Drop zone */}
                        <div
                            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative flex flex-col items-center justify-center w-full sm:w-48 h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all select-none shrink-0 ${isDragging
                                ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 scale-[1.02]"
                                : "border-zinc-200 dark:border-zinc-700 hover:border-emerald-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                }`}
                        >
                            {formData.logoUrl ? (
                                <>
                                    <img
                                        src={formData.logoUrl}
                                        alt="Logo önizleme"
                                        className="absolute inset-0 w-full h-full object-contain rounded-xl p-2"
                                    />
                                    <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold">Değiştir</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={e => { e.stopPropagation(); setFormData(prev => ({ ...prev, logoUrl: "" })); }}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10 shadow"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className={`p-3 rounded-full mb-2 ${isDragging ? "bg-emerald-100 dark:bg-emerald-500/20" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                                        <Upload className={`w-6 h-6 ${isDragging ? "text-emerald-600" : "text-zinc-400"}`} />
                                    </div>
                                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 text-center px-2">
                                        {isDragging ? "Bırakın!" : "Logo yükle"}
                                    </p>
                                    <p className="text-xs text-zinc-400 mt-1">PNG, JPG, SVG</p>
                                </>
                            )}
                        </div>

                        {/* Right: info + preview pill */}
                        <div className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                            <p>Logonuzu bilgisayarınızdan sürükleyip bırakın veya alana tıklayarak seçin.</p>
                            <p className="text-xs">Önerilen boyut: <strong>400×400 px</strong> veya daha büyük, kare veya yuvarlak.</p>
                            {formData.logoUrl && (
                                <div className="flex items-center gap-2 mt-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-lg px-3 py-2">
                                    <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    <span className="text-emerald-700 dark:text-emerald-400 font-medium text-sm">Logo yüklendi</span>
                                </div>
                            )}
                            <p className="text-xs text-zinc-400">
                                ⚠️ Değişiklikler <strong>Kaydet</strong> butonuna bastıktan sonra siteye yansır.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── Temel Bilgiler ─────────────────────────────────────────────── */}
            <Card className="dark:border-zinc-800 dark:bg-zinc-950">
                <CardHeader>
                    <CardTitle>Temel Bilgiler</CardTitle>
                    <CardDescription>Müşterilerinize görünecek genel restoran bilgilerini güncelleyin.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Restoran Adı</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                </CardContent>
            </Card>

            {/* ── Sipariş & İletişim ─────────────────────────────────────────── */}
            <Card className="dark:border-zinc-800 dark:bg-zinc-950">
                <CardHeader>
                    <CardTitle>Sipariş & İletişim</CardTitle>
                    <CardDescription>Siparişlerinizin yönlendirileceği WhatsApp numarasını belirleyin.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="whatsappNumber">WhatsApp Numarası</Label>
                        <Input id="whatsappNumber" name="whatsappNumber" type="tel" value={formData.whatsappNumber} onChange={handleChange} placeholder="Örn: 905551234567" />
                        <p className="text-xs text-zinc-400">Uluslararası kod ile birlikte (örn: 90) giriniz.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="openTime">Açılış Saati</Label>
                            <Input id="openTime" name="openTime" type="time" value={formData.openTime} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="closeTime">Kapanış Saati</Label>
                            <Input id="closeTime" name="closeTime" type="time" value={formData.closeTime} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="minOrderAmount">Minimum Paket Tutarı (TL)</Label>
                        <Input id="minOrderAmount" name="minOrderAmount" type="number" value={formData.minOrderAmount} onChange={handleChange} />
                    </div>
                </CardContent>
            </Card>

            {/* ── Yayınlama ve Domain Yönetimi ───────────────────────────────── */}
            <Card className="dark:border-zinc-800 dark:bg-zinc-950 border-emerald-500/30">
                <CardHeader>
                    <CardTitle>Yayınlama ve Domain Yönetimi</CardTitle>
                    <CardDescription>Müşterilerinizin sitenize ulaşacağı adresi belirleyin.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Option A: Free Subdomain */}
                        <div className="flex flex-col space-y-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                            <div className="space-y-1">
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black">A</span>
                                    Ücretsiz Alt Alan Adı
                                </h3>
                                <p className="text-sm text-zinc-500">paketsipari-ver.app Uzantısını Kullan</p>
                            </div>

                            <div className="space-y-3 flex-1">
                                <div className="space-y-1.5">
                                    <Label htmlFor="slug" className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Dükkan Adı (Slug)</Label>
                                    <Input
                                        id="slug"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        placeholder="Örn: hasankofte"
                                        className="h-11 font-medium bg-white dark:bg-zinc-950"
                                    />
                                </div>

                                {formData.slug ? (
                                    <div className="mt-2 text-sm text-emerald-700 dark:text-emerald-300 font-medium bg-emerald-100/50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-3 py-2.5 rounded-lg break-all flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                        {formData.slug}.paketsipari-ver.app
                                    </div>
                                ) : (
                                    <div className="mt-2 text-sm text-zinc-500 italic px-1">
                                        Lütfen bir dükkan adı girin.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Option B: Custom Domain */}
                        <div className="flex flex-col justify-between space-y-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
                            <div className="space-y-3">
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black">B</span>
                                    Kendi Domainini Kullan
                                </h3>
                                <p className="text-sm text-zinc-500 leading-relaxed">
                                    Mevcut veya yeni alacağınız web adresinizi (örn: <strong>www.restoranadi.com</strong>) özel olarak sisteminize bağlamak ister misiniz? Müşterilerinize daha kurumsal bir görüntü sunun.
                                </p>
                            </div>

                            <div className="pt-2 mt-auto">
                                <Button
                                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold transition-all shadow-lg shadow-[#25D366]/20 h-auto py-3 whitespace-normal text-center leading-tight hover:scale-[1.02] active:scale-[0.98]"
                                    onClick={() => window.open('https://wa.me/905330310245?text=Merhaba,%20alan%20ad%C4%B1m%C4%B1%20sisteme%20ba%C4%9Flamak%20istiyorum.', '_blank')}
                                    type="button"
                                >
                                    <MessageCircle className="w-5 h-5 mr-2 shrink-0 fill-current" />
                                    <span>Alan Adını Bağlamak İçin<br /><span className="text-xs font-medium opacity-90">Bizimle İletişime Geçin</span></span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mobile Save Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 sm:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
                <Button
                    onClick={handleSave}
                    className={`w-full gap-2 ${saved ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                    size="lg"
                >
                    <Save className="w-5 h-5" />
                    {saved ? "Kaydedildi ✓" : "Değişiklikleri Kaydet"}
                </Button>
            </div>
        </div>
    );
}
