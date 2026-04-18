"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    UtensilsCrossed,
    Settings,
    Moon,
    Sun,
    Menu,
    ChevronLeft,
    ExternalLink,
    Megaphone,
    CreditCard,
    Bike,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useRestaurant } from "@/components/restaurant-provider";
import { RestaurantLogo } from "@/components/restaurant-logo";


const navItems = [
    { name: "Özet İzleme", href: "/admin", icon: LayoutDashboard },
    { name: "Canlı Siparişler", href: "/admin/orders", icon: ShoppingBag },
    { name: "Müşterilerim", href: "/admin/customers", icon: Users },
    { name: "Kurye Yönetimi", href: "/admin/couriers", icon: Bike },
    { name: "Menü Yönetimi", href: "/admin/menu", icon: UtensilsCrossed },
    { name: "Pazarlama", href: "/admin/marketing", icon: Megaphone },
    { name: "Abonelik", href: "/admin/subscription", icon: CreditCard },
    { name: "Restoran Ayarları", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { restaurantData, updateRestaurantData } = useRestaurant();

    useEffect(() => setMounted(true), []);

    const toggleOnlineStatus = () => {
        updateRestaurantData({
            businessHours: {
                ...restaurantData.businessHours,
                isOpenNow: !restaurantData.businessHours.isOpenNow
            }
        });
    };

    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

    const storefrontHref = `/${restaurantData.slug}`;

    // ── Logo or Initial Avatar ─────────────────────────────────────────────
    const LogoOrAvatar = ({ size = "md" }: { size?: "sm" | "md" }) => {
        const pixelSize = size === "sm" ? 28 : 32;
        return (
            <RestaurantLogo
                name={restaurantData.name}
                logoUrl={restaurantData.logoUrl}
                size={pixelSize}
                className="shrink-0"
            />
        );
    };


    const sidebarContent = (
        <div className="flex flex-col h-full bg-[#0F172A] border-r border-white/5 transition-colors duration-300">
            {/* Header */}
            <div className={`p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 ${isCollapsed ? "justify-center" : ""}`}>
                {!isCollapsed && (
                    <div className="flex items-center gap-3 overflow-hidden">
                        <LogoOrAvatar />
                        <span className="font-bold text-base truncate text-white">{restaurantData.name}</span>
                    </div>
                )}
                {isCollapsed && <LogoOrAvatar />}

                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex text-zinc-400 hover:text-white hover:bg-white/10 shrink-0"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
                </Button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                        <Link key={item.name} href={item.href}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative mb-1 ${isActive
                                    ? "text-white bg-indigo-600 font-semibold shadow-lg shadow-indigo-600/20"
                                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                    } ${isCollapsed ? "justify-center" : ""}`}
                            >
                                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : ""}`} />
                                {!isCollapsed && <span className="text-[13px]">{item.name}</span>}
                                {isActive && !isCollapsed && (
                                    <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}

                {/* ── Siteyi Görüntüle ─────────────────────────── */}
                <div className={`pt-2 mt-2 border-t border-zinc-100 dark:border-zinc-800`}>
                    <Link href={storefrontHref} target="_blank" rel="noopener noreferrer">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-zinc-500 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 ${isCollapsed ? "justify-center" : ""}`}
                        >
                            <ExternalLink className="w-4 h-4 shrink-0" />
                            {!isCollapsed && (
                                <div className="flex flex-col leading-tight">
                                    <span className="text-sm font-medium">Siteyi Görüntüle</span>
                                    <span className="text-[10px] text-zinc-400 truncate max-w-[110px]">/{restaurantData.slug}</span>
                                </div>
                            )}
                        </motion.div>
                    </Link>
                </div>
            </div>

            {/* Footer / Toggles */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                {/* Theme Toggle */}
                <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} text-sm text-zinc-600 dark:text-zinc-400`}>
                    {!isCollapsed && <span>Karanlık Mod</span>}
                    <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        {mounted && theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </Button>
                </div>

                {/* Online Toggle */}
                <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} p-2 rounded-lg ${restaurantData.businessHours.isOpenNow ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-red-50 dark:bg-red-500/10"}`}>
                    {!isCollapsed && (
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                                {restaurantData.businessHours.isOpenNow && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
                                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${restaurantData.businessHours.isOpenNow ? "bg-emerald-500" : "bg-red-500"}`} />
                            </span>
                            <span className={`text-sm font-medium ${restaurantData.businessHours.isOpenNow ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                                {restaurantData.businessHours.isOpenNow ? "Açık" : "Kapalı"}
                            </span>
                        </div>
                    )}
                    <Switch
                        checked={restaurantData.businessHours.isOpenNow}
                        onCheckedChange={toggleOnlineStatus}
                        className={isCollapsed ? "scale-75" : ""}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile top bar */}
            <div className="md:hidden flex items-center justify-between bg-white/90 dark:bg-zinc-950/90 p-4 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="text-white font-black text-xl">P</span>
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-black text-base text-zinc-900 dark:text-zinc-100">{restaurantData.name}</span>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Yönetim Paneli</span>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                    <Menu className="w-5 h-5 dark:text-zinc-100" />
                </Button>
            </div>

            {/* Desktop sidebar */}
            <aside className={`hidden md:block h-screen sticky top-0 transition-all duration-300 z-40 ${isCollapsed ? "w-20" : "w-64"}`}>
                {sidebarContent}
            </aside>

            {/* Mobile overlay */}
            {isMobileOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileOpen(false)}>
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        className="w-64 h-full"
                        onClick={e => e.stopPropagation()}
                    >
                        {sidebarContent}
                    </motion.div>
                </div>
            )}
        </>
    );
}
