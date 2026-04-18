"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthModals } from "./auth-modals";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                isScrolled ? "py-4" : "py-6"
            )}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className={cn(
                    "flex items-center justify-between transition-all duration-500 mx-auto",
                    isScrolled 
                        ? "bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 py-3 px-6 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] max-w-5xl" 
                        : "bg-transparent py-2 px-0 max-w-7xl"
                )}>
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                            <span className="text-white font-black text-xl">P</span>
                        </div>
                        <span className="font-black text-2xl tracking-tighter text-zinc-900 dark:text-zinc-100">
                            Paket<span className="text-primary italic">Servis</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-10">
                        {["Özellikler", "Nasıl Çalışır?", "Fiyatlandırma"].map((item) => (
                            <Link 
                                key={item}
                                href={`#${item.toLowerCase().replace("?", "").replace(" ", "-")}`} 
                                className="text-[13px] font-bold uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <AuthModals />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-zinc-950 flex flex-col p-8 animate-in fade-in slide-in-from-right duration-300">
                    <div className="flex justify-between items-center mb-12">
                         <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <span className="text-white font-black text-xl">P</span>
                            </div>
                            <span className="font-black text-2xl tracking-tighter text-zinc-900 dark:text-zinc-100">
                                Paket<span className="text-primary italic">Servis</span>
                            </span>
                        </Link>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-6">
                        {["Özellikler", "Nasıl Çalışır?", "Fiyatlandırma"].map((item) => (
                            <Link
                                key={item}
                                href={`#${item.toLowerCase().replace("?", "").replace(" ", "-")}`}
                                className="text-3xl font-black tracking-tighter hover:text-primary transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                    
                    <div className="mt-auto flex flex-col gap-4 pt-10 border-t border-zinc-100 dark:border-zinc-800">
                        <AuthModals />
                    </div>
                </div>
            )}
        </nav>
    );
}
