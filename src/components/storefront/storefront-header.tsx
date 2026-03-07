import { Restaurant } from "@/types";
import { Clock, Phone, MapPin, Star, ChevronRight, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RestaurantLogo } from "@/components/restaurant-logo";


export default function StorefrontHeader({ restaurant }: { restaurant: Restaurant }) {
    const initials = restaurant.name.substring(0, 2).toUpperCase();

    return (
        <header className="relative bg-white overflow-hidden">
            {/* Hero Banner */}
            <div className="relative h-52 md:h-72 w-full overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2274&auto=format&fit=crop"
                    alt={`${restaurant.name} cover`}
                    className="w-full h-full object-cover scale-105 transition-transform duration-[8000ms] hover:scale-100"
                />
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-900/30 to-transparent" />

                {/* Floating tag on cover */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                    Hızlı Teslimat
                </div>
            </div>

            {/* Info Card — floats over the hero */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 -mt-20 pb-0">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100/80 overflow-hidden">
                    <div className="flex flex-col sm:flex-row gap-0">

                        {/* Left: Logo + Name */}
                        <div className="flex items-start gap-4 p-5 sm:p-6 flex-1">
                            {/* Logo */}
                            <div className="relative shrink-0">
                                <RestaurantLogo
                                    name={restaurant.name}
                                    logoUrl={restaurant.logoUrl}
                                    size={100}
                                    className="sm:w-24 sm:h-24 w-20 h-20 border-2 border-primary/20 shadow-xl ring-4 ring-white"
                                />
                            </div>

                            {/* Name & details */}

                            <div className="flex-1 min-w-0 pt-1">
                                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-none">
                                    {restaurant.name}
                                </h1>
                                <p className="text-sm text-gray-500 mt-1 font-medium">
                                    Kebap • Pide • Izgara Çeşitleri
                                </p>

                                {/* Badges row */}
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                    {/* Rating */}
                                    <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                        4.8
                                        <span className="font-normal text-amber-500/80 ml-0.5">(500+)</span>
                                    </span>

                                    {/* Open status */}
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${restaurant.businessHours.isOpenNow
                                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                        : "bg-red-50 border-red-200 text-red-600"
                                        }`}>
                                        <span className={`w-2 h-2 rounded-full ${restaurant.businessHours.isOpenNow ? "bg-emerald-500 animate-pulse" : "bg-red-400"
                                            }`} />
                                        {restaurant.businessHours.isOpenNow ? "Açık" : "Kapalı"}
                                        <span className="font-normal opacity-70 ml-0.5">
                                            {restaurant.businessHours.open}–{restaurant.businessHours.close}
                                        </span>
                                    </span>

                                    {/* Location */}
                                    <span className="hidden sm:inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg font-medium">
                                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                        Merkez, İstanbul
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Stats */}
                        <div className="flex sm:flex-col justify-around sm:justify-center gap-0 border-t sm:border-t-0 sm:border-l border-gray-100 bg-gray-50/60 px-5 py-4 sm:px-8 sm:py-6 sm:min-w-[180px] sm:rounded-none rounded-b-2xl">
                            <div className="flex flex-col items-center gap-1 text-center">
                                <span className="text-2xl font-black text-primary">
                                    {restaurant.minOrderAmount}
                                    <span className="text-sm font-bold ml-0.5">₺</span>
                                </span>
                                <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Min. Sipariş</span>
                            </div>
                            <div className="w-px bg-gray-200 sm:hidden" />
                            <div className="flex flex-col items-center gap-1 text-center">
                                <span className="text-2xl font-black text-emerald-600">
                                    25
                                    <span className="text-sm font-bold ml-0.5">dk</span>
                                </span>
                                <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Teslimat</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer */}
            <div className="h-5" />
        </header>
    );
}
