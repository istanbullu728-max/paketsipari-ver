"use client";

import React from "react";

interface RestaurantLogoProps {
    name: string;
    logoUrl?: string;
    className?: string;
    size?: number;
}

/**
 * RestaurantLogo bileşeni, eğer logoUrl mevcutsa resmi, 
 * mevcut değilse restoran isminden dinamik olarak oluşturulan 
 * minimalist ve modern bir SVG logoyu gösterir.
 */
export function RestaurantLogo({
    name,
    logoUrl,
    className = "",
    size = 100
}: RestaurantLogoProps) {

    if (logoUrl) {
        return (
            <img
                src={logoUrl}
                alt={name}
                className={`object-cover rounded-full border border-zinc-200 dark:border-zinc-800 ${className}`}
                style={{ width: size, height: size }}
            />
        );
    }

    // Varsayılan logo için baş harfler (varsa ilk iki kelimenin baş harfleri)
    const nameParts = name.trim().split(/\s+/);
    const initials = nameParts.length > 1
        ? (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase()
        : name.trim().substring(0, 2).toUpperCase();

    // Şık ve Premium Renk Paleti (Altın & Koyu Antrasit)
    const primaryBg = "#0f172a"; // Deep Slate/Navy
    const accentGold = "#fbbf24"; // Amber/Gold
    const softWhite = "#f8fafc";

    return (
        <div
            className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-full shadow-lg ${className}`}
            style={{ width: size, height: size }}
        >
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <defs>
                    <linearGradient id="premiumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#020617" />
                    </linearGradient>

                    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                        <feOffset dx="0" dy="1" result="offsetblur" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.3" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Ana Arkaplan */}
                <circle cx="50" cy="50" r="50" fill="url(#premiumGrad)" />

                {/* Dış İnce Çerçeve */}
                <circle cx="50" cy="50" r="46" stroke={accentGold} strokeWidth="0.5" strokeOpacity="0.4" />

                {/* İç Dekoratif Çerçeve (Noktalı veya Kesikli) */}
                <circle cx="50" cy="50" r="42" stroke={accentGold} strokeWidth="1.5" strokeDasharray="1 3" strokeOpacity="0.6" />

                {/* Orta Logo Alanı */}
                <circle cx="50" cy="50" r="35" fillOpacity="0.05" fill={softWhite} stroke={accentGold} strokeWidth="1" />

                {/* Baş Harfler */}
                <text
                    x="50"
                    y="52"
                    dominantBaseline="central"
                    textAnchor="middle"
                    fill={softWhite}
                    filter="url(#softShadow)"
                    style={{
                        fontSize: initials.length > 1 ? "28px" : "38px",
                        fontWeight: 800,
                        fontFamily: "var(--font-heading), 'Outfit', 'Inter', sans-serif",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase"
                    }}
                >
                    {initials}
                </text>

                {/* Est / Süsleme Detayı */}
                <path
                    d="M35 65 L45 65 M55 65 L65 65"
                    stroke={accentGold}
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeOpacity="0.8"
                />
                <circle cx="50" cy="65" r="1.5" fill={accentGold} />
            </svg>
        </div>
    );
}
