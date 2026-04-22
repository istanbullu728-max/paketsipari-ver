"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, UserPlus, Building2, Mail, Lock, Phone, ArrowRight } from "lucide-react";

export function AuthModals() {
    const router = useRouter();
    const [mode, setMode] = useState<"login" | "register">("login");
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        businessName: "",
        email: "",
        password: "",
        phone: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (mode === "register" && !formData.businessName) newErrors.businessName = "İşletme adı zorunludur";
        if (!formData.email) newErrors.email = "E-posta zorunludur";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Geçersiz e-posta";
        if (!formData.password) newErrors.password = "Şifre zorunludur";
        else if (formData.password.length < 6) newErrors.password = "Şifre en az 6 karakter olmalıdır";
        if (mode === "register" && !formData.phone) newErrors.phone = "Telefon zorunludur";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setIsLoading(true);

            // Simulate API call for login/register
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setIsLoading(false);
            // On success, redirect to admin dashboard
            router.push("/admin");
        }
    };

    const handleDemoLogin = () => {
        setIsLoading(true);
        // Simulate a quick demo entry
        setTimeout(() => {
            setIsLoading(false);
            router.push("/admin");
        }, 800);
    };

    return (
        <>
            <Dialog onOpenChange={(open) => !open && setErrors({})}>
                <DialogTrigger asChild>
                    <Button variant="ghost" className="text-sm font-semibold" onClick={() => setMode("login")}>
                        Giriş Yap
                    </Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                    <Button className="text-sm font-semibold shadow-md hover:shadow-lg transition-all" onClick={() => setMode("register")}>
                        Üye Ol
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-primary p-6 text-white text-center relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-black/10 rounded-full blur-xl" />

                        <DialogHeader className="relative z-10">
                            <DialogTitle className="text-2xl font-bold text-white">
                                {mode === "login" ? "Tekrar Hoş Geldiniz!" : "Hemen Kayıt Olun"}
                            </DialogTitle>
                            <DialogDescription className="text-white/80 mt-1">
                                {mode === "login"
                                    ? "Sisteminize erişmek için bilgilerinizi girin."
                                    : "İşletmenizi dijitale taşımak için ilk adımı atın."}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-5 bg-white dark:bg-zinc-950">
                        {mode === "register" && (
                            <div className="space-y-2">
                                <Label htmlFor="businessName">İşletme Adı</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                                    <Input
                                        id="businessName"
                                        placeholder="Örn: Lezzet Restoran"
                                        className={cn("pl-10 h-10 ring-offset-background focus-visible:ring-primary", errors.businessName && "border-red-500")}
                                        value={formData.businessName}
                                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                    />
                                </div>
                                {errors.businessName && <p className="text-xs text-red-500 font-medium">{errors.businessName}</p>}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">E-posta</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="isim@isletme.com"
                                    className={cn("pl-10 h-10 focus-visible:ring-primary", errors.email && "border-red-500")}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Şifre</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className={cn("pl-10 h-10 focus-visible:ring-primary", errors.password && "border-red-500")}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
                            
                            {mode === "login" && (
                                <button
                                    type="button"
                                    onClick={handleDemoLogin}
                                    className="w-full mt-2 py-2 px-4 rounded-lg border border-dashed border-primary/40 text-primary text-sm font-semibold hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                                >
                                    Demo Girişi (Şifresiz)
                                </button>
                            )}
                        </div>

                        {mode === "register" && (
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefon</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                                    <Input
                                        id="phone"
                                        placeholder="05xx xxx xx xx"
                                        className={cn("pl-10 h-10 focus-visible:ring-primary", errors.phone && "border-red-500")}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone}</p>}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {mode === "login" ? "Giriş Yapılıyor..." : "Kayıt Olunuyor..."}
                                </span>
                            ) : (
                                <>
                                    {mode === "login" ? "Giriş Yap" : "Ücretsiz Başla"}
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </>
                            )}
                        </Button>

                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={() => setMode(mode === "login" ? "register" : "login")}
                                className="text-sm font-medium text-zinc-500 hover:text-primary transition-colors"
                            >
                                {mode === "login"
                                    ? "Henüz hesabınız yok mu? Üye Olun"
                                    : "Zaten üye misiniz? Giriş Yapın"}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
