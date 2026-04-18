
"use client";

import { useState, useEffect } from "react";
import { ServiceArea } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Loader2, Globe, Check, Search } from "lucide-react";
import { getProvinces, getDistricts, getNeighborhoods, Province, District, Neighborhood } from "@/lib/turkey-geography";

interface Props {
    serviceAreas: ServiceArea[];
    onChange: (areas: ServiceArea[]) => void;
}

export default function ServiceAreaManager({ serviceAreas, onChange }: Props) {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
    
    const [loading, setLoading] = useState({ provinces: false, districts: false, neighborhoods: false });
    
    const [newArea, setNewArea] = useState({
        city: "",
        cityId: 0,
        district: "",
        districtId: 0,
        selectedMahalles: [] as string[]
    });

    const [showAddForm, setShowAddForm] = useState(false);

    // Initial Load
    useEffect(() => {
        const load = async () => {
            setLoading(p => ({ ...p, provinces: true }));
            const data = await getProvinces();
            setProvinces(data);
            setLoading(p => ({ ...p, provinces: false }));
        };
        load();
    }, []);

    // Load Districts when City changes
    useEffect(() => {
        if (!newArea.cityId) {
            setDistricts([]);
            return;
        }
        const load = async () => {
            setLoading(p => ({ ...p, districts: true }));
            const data = await getDistricts(newArea.cityId);
            setDistricts(data);
            setLoading(p => ({ ...p, districts: false }));
        };
        load();
    }, [newArea.cityId]);

    // Load Neighborhoods when District changes
    useEffect(() => {
        if (!newArea.districtId) {
            setNeighborhoods([]);
            return;
        }
        const load = async () => {
            setLoading(p => ({ ...p, neighborhoods: true }));
            const data = await getNeighborhoods(newArea.districtId);
            setNeighborhoods(data);
            setLoading(p => ({ ...p, neighborhoods: false }));
        };
        load();
    }, [newArea.districtId]);

    const handleAdd = () => {
        if (!newArea.city || !newArea.district) return;
        
        const area: ServiceArea = {
            id: Math.random().toString(36).substr(2, 9),
            city: newArea.city,
            district: newArea.district,
            neighborhoods: newArea.selectedMahalles
        };
        
        onChange([...serviceAreas, area]);
        setNewArea({ city: "", cityId: 0, district: "", districtId: 0, selectedMahalles: [] });
        setShowAddForm(false);
    };

    const removeArea = (id: string) => {
        onChange(serviceAreas.filter(a => a.id !== id));
    };

    const toggleMahalle = (m: string) => {
        setNewArea(prev => ({
            ...prev,
            selectedMahalles: prev.selectedMahalles.includes(m)
                ? prev.selectedMahalles.filter(x => x !== m)
                : [...prev.selectedMahalles, m]
        }));
    };

    return (
        <div className="space-y-6">
            {/* List of current areas */}
            <div className="space-y-3">
                {serviceAreas.map(area => (
                    <div key={area.id} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-sm group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                                <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                                    {area.city} / {area.district}
                                </h4>
                                <p className="text-xs text-zinc-500">
                                    {area.neighborhoods.length > 0 
                                        ? `${area.neighborhoods.length} Mahalle Seçili` 
                                        : "Tüm İlçe Kapsamında"}
                                </p>
                            </div>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeArea(area.id)}
                            className="text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                ))}

                {serviceAreas.length === 0 && !showAddForm && (
                    <div className="text-center py-10 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl">
                        <p className="text-sm text-zinc-400">Henüz bir hizmet bölgesi tanımlanmadı.</p>
                        <p className="text-xs text-zinc-500 mt-1">Tanımlama yapılmazsa tüm bölgelere hizmet verilir.</p>
                    </div>
                )}
            </div>

            {/* Add Area Form */}
            {showAddForm ? (
                <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm">Yeni Bölge Ekle</h4>
                        <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>Vazgeç</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Province Select */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Şehir</Label>
                            <div className="relative">
                                <select 
                                    className="w-full h-11 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    value={newArea.cityId || ""}
                                    onChange={(e) => {
                                        const id = parseInt(e.target.value);
                                        const p = provinces.find(x => x.id === id);
                                        setNewArea({ 
                                            city: p?.name || "", 
                                            cityId: id,
                                            district: "", 
                                            districtId: 0,
                                            selectedMahalles: [] 
                                        });
                                    }}
                                    disabled={loading.provinces}
                                >
                                    <option value="">Şehir Seçin</option>
                                    {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                {loading.provinces && <Loader2 className="absolute right-4 top-3 h-5 w-5 animate-spin text-zinc-400" />}
                            </div>
                        </div>

                        {/* District Select */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">İlçe</Label>
                            <div className="relative">
                                <select 
                                    className="w-full h-11 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
                                    value={newArea.districtId || ""}
                                    onChange={(e) => {
                                        const id = parseInt(e.target.value);
                                        const d = districts.find(x => x.id === id);
                                        setNewArea(prev => ({ 
                                            ...prev, 
                                            district: d?.name || "", 
                                            districtId: id,
                                            selectedMahalles: [] 
                                        }));
                                    }}
                                    disabled={!newArea.cityId || loading.districts}
                                >
                                    <option value="">İlçe Seçin</option>
                                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                                {loading.districts && <Loader2 className="absolute right-4 top-3 h-5 w-5 animate-spin text-zinc-400" />}
                            </div>
                        </div>
                    </div>

                    {/* Neighborhoods Section */}
                    {newArea.district && (
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Mahalleler ({neighborhoods.length})</Label>
                                {neighborhoods.length > 0 && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-[10px] h-6 px-2 text-emerald-600 font-bold"
                                        onClick={() => setNewArea(prev => ({
                                            ...prev,
                                            selectedMahalles: prev.selectedMahalles.length === neighborhoods.length 
                                                ? [] 
                                                : neighborhoods.map(n => n.name)
                                        }))}
                                    >
                                        {newArea.selectedMahalles.length === neighborhoods.length ? "Tümünü Kaldır" : "Tümünü Seç"}
                                    </Button>
                                )}
                            </div>
                            
                            <div className="relative">
                                {loading.neighborhoods ? (
                                    <div className="flex items-center justify-center py-10 bg-white dark:bg-zinc-950 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                                        <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                                    </div>
                                ) : (
                                    <div className="max-h-[200px] overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
                                        {neighborhoods.map(n => (
                                            <button
                                                key={n.id}
                                                onClick={() => toggleMahalle(n.name)}
                                                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                                                    newArea.selectedMahalles.includes(n.name)
                                                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                                                    : "bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800 hover:border-emerald-400"
                                                }`}
                                            >
                                                <span className="truncate">{n.name}</span>
                                                {newArea.selectedMahalles.includes(n.name) && <Check className="w-3.5 h-3.5 shrink-0 ml-2" />}
                                            </button>
                                        ))}
                                        {neighborhoods.length === 0 && (
                                            <p className="col-span-full py-6 text-center text-xs text-zinc-500 italic">Bu ilçe için mahalle verisi bulunamadı.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="pt-2">
                        <Button 
                            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                            disabled={!newArea.city || !newArea.district}
                            onClick={handleAdd}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Bölgeyi Kaydet
                        </Button>
                    </div>
                </div>
            ) : (
                <Button 
                    variant="outline" 
                    className="w-full border-dashed border-2 h-14 text-zinc-500 hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-50/30 font-bold transition-all rounded-2xl"
                    onClick={() => setShowAddForm(true)}
                >
                    <Plus className="w-4 h-4 mr-2" /> Yeni Hizmet Bölgesi Tanımla
                </Button>
            )}
        </div>
    );
}
