
"use client";

import { useState } from "react";
import { useCouriers, Courier } from "@/components/courier-provider";
import { 
    Bike, 
    Plus, 
    Trash2, 
    Phone, 
    User, 
    MoreVertical, 
    CheckCircle2, 
    XCircle,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function CouriersPage() {
    const { couriers, addCourier, deleteCourier, toggleCourierStatus } = useCouriers();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [formData, setFormData] = useState({ name: "", phone: "" });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) return;
        addCourier(formData);
        setFormData({ name: "", phone: "" });
        setIsAddOpen(false);
    };

    const filteredCouriers = couriers.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.phone.includes(searchQuery)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight dark:text-zinc-100">Kurye Yönetimi</h1>
                    <p className="text-zinc-500 mt-1">Teslimat ekibinizi yönetin ve siparişleri yönlendirin.</p>
                </div>
                <Button 
                    onClick={() => setIsAddOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-12 px-6 rounded-2xl shadow-lg shadow-indigo-600/20"
                >
                    <Plus className="w-5 h-5" /> Yeni Kurye Ekle
                </Button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input 
                    placeholder="Kurye ara (isim veya telefon)..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredCouriers.map((courier) => (
                        <motion.div
                            key={courier.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:shadow-xl transition-all duration-300">
                                <CardContent className="p-0">
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                    <Bike className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg dark:text-zinc-100">{courier.name}</h3>
                                                    <Badge 
                                                        variant="outline" 
                                                        className={`mt-1 gap-1 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${
                                                            courier.isActive 
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" 
                                                            : "bg-zinc-50 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                                                        }`}
                                                    >
                                                        {courier.isActive ? "Aktif" : "Pasif"}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => toggleCourierStatus(courier.id)}
                                                    className="h-8 w-8 text-zinc-400 hover:text-indigo-600"
                                                    title={courier.isActive ? "Pasife Al" : "Aktife Al"}
                                                >
                                                    {courier.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => {
                                                        if (confirm(`${courier.name} adlı kuryeyi silmek istiyor musunuz?`)) {
                                                            deleteCourier(courier.id);
                                                        }
                                                    }}
                                                    className="h-8 w-8 text-zinc-400 hover:text-red-600 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                                                <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                                                    <Phone className="w-4 h-4" />
                                                </div>
                                                <a href={`tel:${courier.phone}`} className="hover:text-indigo-600 transition-colors font-medium">
                                                    {courier.phone}
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                                                <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <span className="font-mono text-zinc-400">{courier.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                                        <span>Canlı Sipariş: 0</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${courier.isActive ? "bg-emerald-500 animate-pulse" : "bg-zinc-300"}`} />
                                            {courier.isActive ? "Müsait" : "Meşgul/Kapalı"}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-zinc-950 w-full max-w-md rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
                    >
                        <div className="p-8 space-y-6">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black">Yeni Kurye Ekle</h2>
                                <p className="text-zinc-500 text-sm font-medium">Teslimat ekibinize yeni bir üye dahil edin.</p>
                            </div>

                            <form onSubmit={handleAdd} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-zinc-500 uppercase">İsim Soyisim</Label>
                                    <Input 
                                        autoFocus
                                        placeholder="Örn: Ahmet Yılmaz"
                                        value={formData.name}
                                        onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                                        className="h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-zinc-500 uppercase">Telefon Numarası</Label>
                                    <Input 
                                        type="tel"
                                        placeholder="05XX XXX XX XX"
                                        value={formData.phone}
                                        onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                                        className="h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button 
                                        type="button"
                                        variant="outline" 
                                        onClick={() => setIsAddOpen(false)}
                                        className="flex-1 h-12 rounded-xl text-zinc-500 font-bold"
                                    >
                                        İptal
                                    </Button>
                                    <Button 
                                        type="submit"
                                        className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20"
                                    >
                                        Kuryeyi Kaydet
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}

            {filteredCouriers.length === 0 && !isAddOpen && (
                <div className="py-24 text-center space-y-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-zinc-400">
                        <Bike className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Kurye bulunamadı</h3>
                        <p className="text-zinc-500 text-sm">Arama kriterlerinize uyan kurye bulunamadı veya henüz kurye eklenmedi.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
