"use client";

import { useState, useEffect, useRef } from "react";
import { Order, OrderStatus, useOrders } from "@/components/order-provider";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
    Clock,
    CheckCircle2,
    Truck,
    MessageCircle,
    MapPin,
    Phone,
    FileText,
    Check,
    XCircle,
    ShoppingBag,
    Star,
    PartyPopper,
    Trash2,
    BellRing,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

// ── Status helpers ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, {
    label: string;
    badgeClass: string;
    cardClass: string;
    icon: React.ReactNode;
}> = {
    pending: {
        label: "Bekliyor",
        badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200",
        cardClass: "border-amber-200 bg-amber-50/40 dark:bg-amber-500/5 dark:border-amber-500/20",
        icon: <Clock className="w-4 h-4" />,
    },
    preparing: {
        label: "Hazırlanıyor",
        badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200",
        cardClass: "border-emerald-200 bg-emerald-50/40 dark:bg-emerald-500/5 dark:border-emerald-500/20",
        icon: <CheckCircle2 className="w-4 h-4" />,
    },
    delivering: {
        label: "Yolda 🛵",
        badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200",
        cardClass: "border-blue-200 bg-blue-50/40 dark:bg-blue-500/5 dark:border-blue-500/20",
        icon: <Truck className="w-4 h-4" />,
    },
    completed: {
        label: "Teslim Edildi",
        badgeClass: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400 border-zinc-200",
        cardClass: "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 opacity-80",
        icon: <Check className="w-4 h-4" />,
    },
    cancelled: {
        label: "İptal Edildi",
        badgeClass: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200",
        cardClass: "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 opacity-60",
        icon: <XCircle className="w-4 h-4" />,
    },
};

// ── WhatsApp message templates ────────────────────────────────────────────────

function buildWaLink(phone: string, message: string) {
    const clean = phone.replace(/[^0-9]/g, "");
    const withCountry = clean.startsWith("90") ? clean : `90${clean.replace(/^0/, "")}`;
    return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`;
}

function openWa(order: Order, type: "confirm" | "onway" | "generic" | "review") {
    const first = order.customerName.split(" ")[0];
    const messages: Record<typeof type, string> = {
        confirm:
            `Merhaba ${first}, siparişiniz alındı ve hazırlanmaya başlandı! Afiyet olsun.`,
        onway:
            `Müjde! Siparişiniz yola çıktı, kuryemiz kapınıza gelmek üzere.`,
        review:
            `Merhaba ${first} 👋\n\nUmarız siparişinizi beğenmişsinizdir! Sizi mutlu etmek bizim için çok önemli.\n\n⭐ Deneyiminizi paylaşır mısınız? Değerli görüşleriniz bizi daha iyi yapıyor.\n\nTeşekkürler! 🙏`,
        generic:
            `Merhaba ${first}, siparişinizle ilgili size ulaşıyoruz.`,
    };
    window.open(buildWaLink(order.customerPhone, messages[type]), "_blank");
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
    const { orders, updateOrderStatus, deleteOrder } = useOrders();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [filter, setFilter] = useState<OrderStatus | "all">("all");
    const [showNewOrderAlert, setShowNewOrderAlert] = useState(false);

    // ── Bell notification on new pending order ─────────────────────────
    const prevCountRef = useRef(orders.length);

    const playBell = () => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const playTone = (freq: number, start: number, dur: number, gain: number) => {
                const osc = ctx.createOscillator();
                const env = ctx.createGain();
                osc.connect(env);
                env.connect(ctx.destination);
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
                env.gain.setValueAtTime(0, ctx.currentTime + start);
                env.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.01);
                env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
                osc.start(ctx.currentTime + start);
                osc.stop(ctx.currentTime + start + dur);
            };
            // Two-tone bell: ding-dong
            playTone(880, 0, 0.6, 0.4);
            playTone(660, 0.35, 0.7, 0.3);
        } catch (_) {
            // AudioContext not available (SSR guard)
        }
    };

    useEffect(() => {
        const prev = prevCountRef.current;
        const curr = orders.length;
        if (curr > prev) {
            // Only ring if the newest order is pending
            const newest = orders[0];
            if (newest?.status === "pending") {
                playBell();
                setShowNewOrderAlert(true);
                setTimeout(() => setShowNewOrderAlert(false), 5000);
            }
        }
        prevCountRef.current = curr;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orders.length]);

    const visibleOrders = filter === "all"
        ? orders
        : orders.filter(o => o.status === filter);

    const countByStatus = (s: OrderStatus) => orders.filter(o => o.status === s).length;

    const handleAction = (order: Order, action: "approve" | "onway" | "delivered" | "cancel") => {
        if (action === "approve") {
            updateOrderStatus(order.id, "preparing");
            openWa(order, "confirm");
        } else if (action === "onway") {
            updateOrderStatus(order.id, "delivering");
            openWa(order, "onway");
        } else if (action === "delivered") {
            updateOrderStatus(order.id, "completed");
        } else if (action === "cancel") {
            updateOrderStatus(order.id, "cancelled");
        }
        // Refresh selected drawer if open
        if (selectedOrder?.id === order.id) {
            setSelectedOrder(prev => prev ? { ...prev, status: action === "approve" ? "preparing" : action === "onway" ? "delivering" : action === "delivered" ? "completed" : "cancelled" } : null);
        }
    };

    const FILTER_TABS: { key: OrderStatus | "all"; label: string }[] = [
        { key: "all", label: "Tümü" },
        { key: "pending", label: "Bekliyor" },
        { key: "preparing", label: "Hazırlanıyor" },
        { key: "delivering", label: "Yolda" },
        { key: "completed", label: "Tamamlandı" },
    ];

    return (
        <div className="space-y-6 relative">
            {/* Visual New Order Notification Area */}
            <AnimatePresence>
                {showNewOrderAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                    >
                        <div className="bg-emerald-600 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-emerald-400/30">
                            <div className="bg-white/20 p-2 rounded-full animate-bounce">
                                <BellRing className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-none m-0">YENİ SİPARİŞ GELDİ!</h3>
                                <p className="text-emerald-100 text-sm mt-1 mb-0 leading-none">Listeyi kontrol edin.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight dark:text-zinc-100">Canlı Siparişler</h1>
                    <p className="text-zinc-500 mt-1">Gelen siparişleri aşama aşama yönetin.</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {countByStatus("pending") > 0 && (
                        <span className="animate-pulse flex items-center gap-1.5 text-sm font-semibold text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-500/20">
                            <span className="w-2 h-2 bg-amber-500 rounded-full" />
                            {countByStatus("pending")} bekleyen
                        </span>
                    )}
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {FILTER_TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === tab.key
                            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                            }`}
                    >
                        {tab.label}
                        {tab.key !== "all" && countByStatus(tab.key as OrderStatus) > 0 && (
                            <span className="ml-1.5 bg-white/30 dark:bg-black/20 rounded-full text-xs px-1.5">
                                {countByStatus(tab.key as OrderStatus)}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Orders list */}
            <div className="flex flex-col gap-4">
                <AnimatePresence>
                    {visibleOrders.map((order) => {
                        const cfg = STATUS_CONFIG[order.status];
                        return (
                            <motion.div
                                key={order.id}
                                layout
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.2 }}
                                className={`flex flex-col sm:flex-row gap-4 p-4 md:p-5 rounded-xl border cursor-pointer hover:shadow-md transition-all ${cfg.cardClass}`}
                                onClick={() => setSelectedOrder(order)}
                            >
                                {/* Left: info */}
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="font-mono text-xs font-bold text-zinc-400">#{order.id.replace("ORD-", "")}</span>
                                        <Badge variant="outline" className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold ${cfg.badgeClass}`}>
                                            {cfg.icon}
                                            {cfg.label}
                                        </Badge>
                                        <span className="text-xs text-zinc-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {format(order.createdAt, "HH:mm")}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg dark:text-zinc-100">{order.customerName}</h3>
                                    <p className="text-sm text-zinc-500 flex items-start gap-1.5 line-clamp-1">
                                        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                        {order.customerAddress}
                                    </p>
                                    <p className="text-xs text-zinc-400">
                                        {order.items.map(i => `${i.quantity}x ${i.productName}`).join(" · ")}
                                    </p>
                                </div>

                                {/* Right: price + actions */}
                                <div
                                    className="flex flex-col sm:flex-row items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <div className="font-black text-xl text-emerald-600 dark:text-emerald-400">{order.totalAmount} TL</div>

                                    <div className="flex flex-wrap gap-2 justify-end items-center">
                                        {/* PENDING → Onayla & WA */}
                                        {order.status === "pending" && (
                                            <Button
                                                size="sm"
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                                                onClick={() => handleAction(order, "approve")}
                                            >
                                                <span className="text-base leading-none">✅</span>
                                                Siparişi Onayla
                                            </Button>
                                        )}

                                        {/* PREPARING → Yola Çıkar & WA */}
                                        {order.status === "preparing" && (
                                            <Button
                                                size="sm"
                                                className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                                                onClick={() => handleAction(order, "onway")}
                                            >
                                                <span className="text-base leading-none">🛵</span>
                                                Yola Çıkar
                                            </Button>
                                        )}

                                        {/* DELIVERING → Teslim Edildi */}
                                        {order.status === "delivering" && (
                                            <Button
                                                size="sm"
                                                className="bg-emerald-700 hover:bg-emerald-800 text-white gap-1.5"
                                                onClick={() => handleAction(order, "delivered")}
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                                Teslim Edildi
                                            </Button>
                                        )}

                                        {/* COMPLETED → Yorum İste */}
                                        {order.status === "completed" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-500/30 dark:text-amber-400 dark:hover:bg-amber-500/10 gap-1.5"
                                                onClick={() => openWa(order, "review")}
                                            >
                                                <Star className="w-3.5 h-3.5" />
                                                Yorum İste
                                            </Button>
                                        )}

                                        {/* Delete button — always visible */}
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 shrink-0"
                                            title="Siparişi sil"
                                            onClick={() => {
                                                if (window.confirm("Bu siparişi listeden silmek istediğinize emin misiniz?")) {
                                                    deleteOrder(order.id);
                                                    if (selectedOrder?.id === order.id) setSelectedOrder(null);
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {visibleOrders.length === 0 && (
                    <div className="py-16 text-center text-zinc-400 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                        {filter === "all" ? "Henüz sipariş bulunmuyor." : `Bu aşamada sipariş yok.`}
                    </div>
                )}
            </div>

            {/* ── Order Detail Sheet ─────────────────────────────────────────────── */}
            <Sheet open={!!selectedOrder} onOpenChange={open => !open && setSelectedOrder(null)}>
                {selectedOrder && (() => {
                    const cfg = STATUS_CONFIG[selectedOrder.status];
                    return (
                        <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-2xl">
                            <SheetHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <SheetTitle className="text-2xl font-bold">
                                            Sipariş #{selectedOrder.id.replace("ORD-", "")}
                                        </SheetTitle>
                                        <SheetDescription>
                                            {format(selectedOrder.createdAt, "d MMMM yyyy HH:mm", { locale: tr })}
                                        </SheetDescription>
                                    </div>
                                    <Badge variant="outline" className={`flex items-center gap-1.5 ${cfg.badgeClass}`}>
                                        {cfg.icon}
                                        {cfg.label}
                                    </Badge>
                                </div>

                                {/* Progress stepper */}
                                <div className="flex items-center gap-1 mt-4">
                                    {(["pending", "preparing", "delivering", "completed"] as OrderStatus[]).map((step, idx) => {
                                        const steps: OrderStatus[] = ["pending", "preparing", "delivering", "completed"];
                                        const currentIdx = steps.indexOf(selectedOrder.status);
                                        const isReached = idx <= currentIdx && selectedOrder.status !== "cancelled";
                                        return (
                                            <div key={step} className={`flex items-center ${idx < 3 ? "flex-1" : ""}`}>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 shrink-0 transition-all ${isReached ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-400"}`}>
                                                    {isReached ? "✓" : idx + 1}
                                                </div>
                                                {idx < 3 && (
                                                    <div className={`h-0.5 flex-1 mx-1 transition-all ${idx < currentIdx && selectedOrder.status !== "cancelled" ? "bg-emerald-400" : "bg-zinc-200 dark:bg-zinc-700"}`} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="flex justify-between text-[10px] text-zinc-400 mt-1 px-0.5">
                                    <span>Bekliyor</span>
                                    <span>Hazırlanıyor</span>
                                    <span>Yolda</span>
                                    <span>Teslim</span>
                                </div>
                            </SheetHeader>

                            <div className="py-6 space-y-6">
                                {/* Customer info */}
                                <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 space-y-4 border border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-700 font-black">
                                            {selectedOrder.customerName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{selectedOrder.customerName}</h4>
                                            <a href={`tel:${selectedOrder.customerPhone}`} className="text-sm text-emerald-600 flex items-center gap-1 hover:underline">
                                                <Phone className="w-3 h-3" />{selectedOrder.customerPhone}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 text-sm text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                                        <MapPin className="w-4 h-4 shrink-0 text-zinc-400 mt-0.5" />
                                        <p>{selectedOrder.customerAddress}</p>
                                    </div>
                                    {selectedOrder.customerNote && (
                                        <div className="flex gap-2 text-sm bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 p-3 rounded-lg border border-amber-100 dark:border-amber-500/20">
                                            <FileText className="w-4 h-4 shrink-0" />
                                            <p className="font-medium">Not: {selectedOrder.customerNote}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Order items */}
                                <div>
                                    <h4 className="font-bold dark:text-zinc-100 mb-4 flex items-center gap-2">
                                        <ShoppingBag className="w-5 h-5 text-zinc-400" />Sipariş İçeriği
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between gap-4">
                                                <div className="flex gap-3">
                                                    <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold shrink-0">
                                                        {item.quantity}×
                                                    </div>
                                                    <div>
                                                        <h5 className="font-medium text-sm dark:text-zinc-100">{item.productName}</h5>
                                                        {item.options.length > 0 && (
                                                            <p className="text-xs text-zinc-400 mt-0.5">{item.options.join(", ")}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-sm font-bold shrink-0 dark:text-zinc-200">{item.price * item.quantity} TL</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-dashed border-zinc-200 dark:border-zinc-700 flex justify-between items-center">
                                        <span className="font-semibold text-zinc-500">Genel Toplam</span>
                                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{selectedOrder.totalAmount} TL</span>
                                    </div>
                                </div>

                                {/* Action buttons — context-aware */}
                                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                                    {selectedOrder.status === "pending" && (
                                        <>
                                            <Button
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                                                onClick={() => {
                                                    handleAction(selectedOrder, "approve");
                                                    setSelectedOrder(null);
                                                }}
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                Onayla — Hazırlanıyor mj. gönder
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full gap-2"
                                                onClick={() => openWa(selectedOrder, "generic")}
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                WhatsApp'ta Görüş
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                                                onClick={() => { handleAction(selectedOrder, "cancel"); setSelectedOrder(null); }}
                                            >
                                                <XCircle className="w-4 h-4" /> İptal Et
                                            </Button>
                                        </>
                                    )}

                                    {selectedOrder.status === "preparing" && (
                                        <>
                                            <Button
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                                                onClick={() => { handleAction(selectedOrder, "onway"); setSelectedOrder(null); }}
                                            >
                                                <Truck className="w-4 h-4" />
                                                Yola Çıkar — Yolda mj. gönder
                                            </Button>
                                            <Button variant="outline" className="w-full gap-2" onClick={() => openWa(selectedOrder, "generic")}>
                                                <MessageCircle className="w-4 h-4" /> WhatsApp'ta Görüş
                                            </Button>
                                        </>
                                    )}

                                    {selectedOrder.status === "delivering" && (
                                        <>
                                            <Button
                                                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white gap-2"
                                                onClick={() => { handleAction(selectedOrder, "delivered"); setSelectedOrder(null); }}
                                            >
                                                <PartyPopper className="w-4 h-4" />
                                                Teslim Edildi
                                            </Button>
                                            <Button variant="outline" className="w-full gap-2" onClick={() => openWa(selectedOrder, "generic")}>
                                                <MessageCircle className="w-4 h-4" /> WhatsApp'ta Görüş
                                            </Button>
                                        </>
                                    )}

                                    {selectedOrder.status === "completed" && (
                                        <>
                                            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg p-3 font-medium">
                                                <Check className="w-4 h-4 shrink-0" />
                                                Bu sipariş başarıyla teslim edildi.
                                            </div>
                                            <Button
                                                className="w-full bg-amber-500 hover:bg-amber-600 text-white gap-2"
                                                onClick={() => openWa(selectedOrder, "review")}
                                            >
                                                <Star className="w-4 h-4" />
                                                Yorum İste (WhatsApp)
                                            </Button>
                                        </>
                                    )}

                                    {selectedOrder.status === "cancelled" && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg p-3 font-medium">
                                            <XCircle className="w-4 h-4 shrink-0" />
                                            Bu sipariş iptal edildi.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    );
                })()}
            </Sheet>
        </div>
    );
}
