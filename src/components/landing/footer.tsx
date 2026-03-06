"use client";

import Link from "next/link";
import { Instagram, Twitter, Facebook, Globe } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-zinc-50 dark:bg-zinc-950 pt-20 pb-10 border-t border-zinc-200 dark:border-zinc-800">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">P</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-100 italic">
                                Paket<span className="text-primary NOT-italic">Servis</span>
                            </span>
                        </Link>
                        <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                            İşletmenizi dijital çağa taşıyan, komisyonsuz paket servis yönetim sistemi.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-6">Ürün</h5>
                        <ul className="space-y-4">
                            <li><Link href="#features" className="text-zinc-500 hover:text-primary text-sm transition-colors">Özellikler</Link></li>
                            <li><Link href="#pricing" className="text-zinc-500 hover:text-primary text-sm transition-colors">Fiyatlandırma</Link></li>
                            <li><Link href="#" className="text-zinc-500 hover:text-primary text-sm transition-colors">Yenilikler</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-6">Destek</h5>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-zinc-500 hover:text-primary text-sm transition-colors">Yardım Merkezi</Link></li>
                            <li><Link href="#" className="text-zinc-500 hover:text-primary text-sm transition-colors">Bize Ulaşın</Link></li>
                            <li><Link href="#" className="text-zinc-500 hover:text-primary text-sm transition-colors">Kullanım Şartları</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-6">Bülten</h5>
                        <p className="text-zinc-500 text-sm mb-4">Yeni güncellemelerden haberdar olun.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="e-posta"
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <button className="bg-primary text-white p-2 rounded-lg hover:scale-105 transition-transform">
                                <Globe className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-zinc-500 text-xs text-center md:text-left">
                        © 2024 Paketservis. Tüm hakları saklıdır.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-zinc-500 hover:text-zinc-900 text-xs">Gizlilik Politikası</Link>
                        <Link href="#" className="text-zinc-500 hover:text-zinc-900 text-xs">Çerez Politikası</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
