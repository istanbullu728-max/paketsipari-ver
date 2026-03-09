"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRestaurant } from "@/components/restaurant-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, Upload, X, Image as ImageIcon, MessageCircle, Clock, Power } from "lucide-react";
import { RestaurantLogo } from "@/components/restaurant-logo";
import { Switch } from "@/components/ui/switch";

const DAYS_MAP: Record<string, string> = {
    'pazartesi': 'Pazartesi',
    'sali': 'Salı',
    'carsamba': 'Çarşamba',
    'persembe': 'Perşembe',
    'cuma': 'Cuma',
    'cumartesi': 'Cumartesi',
    'pazar': 'Pazar',
};

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
        isManualClosed: restaurantData.businessHours.isManualClosed,
        days: restaurantData.businessHours.days,
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
            isManualClosed: restaurantData.businessHours.isManualClosed,
            days: restaurantData.businessHours.days,
        });
    }, [restaurantData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleDayChange = (dayKey: string, field: 'open' | 'close' | 'isClosed', value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            days: {
                ...prev.days,
                [dayKey]: {
                    ...prev.days[dayKey],
                    [field]: value
                }
            }
        }));
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
                isManualClosed: formData.isManualClosed,
                days: formData.days,
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

            {/* ── Restoran Durumu (MANUAL OPEN/CLOSE) ────────────────────────── */}
            <Card className={`dark:border-zinc-800 transition-colors duration-500 ${formData.isManualClosed ? "bg-red-50/50 dark:bg-red-900/10 border-red-200" : "dark:bg-zinc-950"}`}>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                                <Power className={`w-5 h-5 ${formData.isManualClosed ? "text-red-500" : "text-emerald-500"}`} />
                                Restoran Durumu
                            </CardTitle>
                            <CardDescription>
                                Restoranı anlık olarak müşterilere açın veya kapatın.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-2 rounded-2xl border dark:border-zinc-800 shadow-sm">
                            <span className={`text-xs font-bold uppercase tracking-wider ${formData.isManualClosed ? "text-red-500" : "text-emerald-500"}`}>
                                {formData.isManualClosed ? "KAPALI" : "AÇIK"}
                            </span>
                            <Switch
                                checked={!formData.isManualClosed}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isManualClosed: !checked }))}
                            />
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* ── Logo Card ──────────────────────────────────────────────────── */}
            <Card className="dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-emerald-500" />
                        Restoran Logosu
                    </CardTitle>
                    <CardDescription>
                        Otomatik oluşturulan logo veya kendi özel logonuzu buradan yönetin.
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

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        {/* Preview Section */}
                        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 relative group">
                            <Label className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4 self-start">Görünüm Önizleme</Label>

                            <div className="relative">
                                <RestaurantLogo
                                    name={formData.name}
                                    logoUrl={formData.logoUrl}
                                    size={140}
                                    className="shadow-2xl ring-4 ring-white dark:ring-zinc-800"
                                />

                                {formData.logoUrl && (
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, logoUrl: "" }))}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg transition-transform hover:scale-110 active:scale-95"
                                        title="Logoyu Kaldır"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <p className="mt-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {formData.logoUrl ? "Özel Logo Aktif" : "Otomatik Logo Aktif"}
                            </p>
                        </div>

                        {/* Action Section */}
                        <div className="md:col-span-7 space-y-5">
                            <div
                                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`group flex flex-col items-center justify-center py-10 px-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${isDragging
                                    ? "border-emerald-500 bg-emerald-500/5 scale-[1.01]"
                                    : "border-zinc-200 dark:border-zinc-800 hover:border-emerald-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                    }`}
                            >
                                <div className={`p-4 rounded-2xl mb-4 transition-colors ${isDragging ? "bg-emerald-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:text-emerald-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10"
                                    }`}>
                                    <Upload className="w-8 h-8" />
                                </div>

                                <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                                    {isDragging ? "Buraya Bırakın" : "Kendi Logonuzu Yükleyin"}
                                </h4>
                                <p className="text-sm text-zinc-500 text-center max-w-[240px]">
                                    Logonuzu buraya sürükleyin veya <span className="text-emerald-500 font-semibold underline decoration-2 underline-offset-4">bilgisayarınızdan seçin</span>.
                                </p>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mt-4">PNG, JPG veya SVG (Max 5MB)</p>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <div className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                    <span>Logonuz yoksa sistem dükkan isminizden <strong>özel vektörel bir logo</strong> üretir.</span>
                                </div>
                                <div className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                    <span>Yüklenen logolar kare formatta ve şeffaf (PNG/SVG) olduğunda daha şık görünür.</span>
                                </div>
                            </div>
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

            {/* ── Haftalık Çalışma Saatleri ───────────────────────────────────── */}
            <Card className="dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-emerald-500" />
                        Haftalık Çalışma Saatleri
                    </CardTitle>
                    <CardDescription>
                        Her gün için ayrı açılış ve kapanış saatlerini belirleyin.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {Object.entries(DAYS_MAP).map(([key, label]) => {
                            const dayConfig = formData.days[key];
                            return (
                                <div key={key} className={`flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 transition-colors ${dayConfig.isClosed ? "bg-zinc-50/50 dark:bg-zinc-900/30" : "bg-white dark:bg-zinc-950"}`}>
                                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                                        <div className="w-24">
                                            <span className={`font-bold ${dayConfig.isClosed ? "text-zinc-400" : "text-zinc-900 dark:text-zinc-100"}`}>
                                                {label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                size="sm"
                                                checked={!dayConfig.isClosed}
                                                onCheckedChange={(checked) => handleDayChange(key, 'isClosed', !checked)}
                                            />
                                            <span className="text-xs font-medium text-zinc-500">
                                                {dayConfig.isClosed ? "Kapalı" : "Açık"}
                                            </span>
                                        </div>
                                    </div>

                                    {!dayConfig.isClosed && (
                                        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2 duration-300">
                                            <div className="relative">
                                                <Input
                                                    type="time"
                                                    value={dayConfig.open}
                                                    onChange={(e) => handleDayChange(key, 'open', e.target.value)}
                                                    className="w-32 h-10 bg-zinc-50 dark:bg-zinc-900 border-none font-medium"
                                                />
                                            </div>
                                            <span className="text-zinc-400 font-bold">—</span>
                                            <div className="relative">
                                                <Input
                                                    type="time"
                                                    value={dayConfig.close}
                                                    onChange={(e) => handleDayChange(key, 'close', e.target.value)}
                                                    className="w-32 h-10 bg-zinc-50 dark:bg-zinc-900 border-none font-medium"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {dayConfig.isClosed && (
                                        <div className="bg-zinc-100 dark:bg-zinc-800/50 px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 uppercase tracking-widest md:w-[285px] text-center">
                                            Tüm Gün Kapalı
                                        </div>
                                    )}
                                </div>
                            );
                        })}
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
                    {/* Old simple time inputs removed as we now have weekly schedule */}
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
