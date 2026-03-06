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
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
                isScrolled
                    ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-zinc-200 dark:border-zinc-800 py-3 shadow-sm"
                    : "bg-transparent border-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">P</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-100 italic">
                            Paket<span className="text-primary NOT-italic">Servis</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-sm font-medium text-zinc-600 hover:text-primary transition-colors">Özellikler</Link>
                        <Link href="#how-it-works" className="text-sm font-medium text-zinc-600 hover:text-primary transition-colors">Nasıl Çalışır?</Link>
                        <Link href="#pricing" className="text-sm font-medium text-zinc-600 hover:text-primary transition-colors">Fiyatlandırma</Link>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <AuthModals />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-zinc-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
                    <Link
                        href="#features"
                        className="text-lg font-medium p-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Özellikler
                    </Link>
                    <Link
                        href="#how-it-works"
                        className="text-lg font-medium p-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Nasıl Çalışır?
                    </Link>
                    <Link
                        href="#pricing"
                        className="text-lg font-medium p-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Fiyatlandırma
                    </Link>
                    <div className="flex flex-col gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <AuthModals />
                    </div>
                </div>
            )}
        </nav>
    );
}
