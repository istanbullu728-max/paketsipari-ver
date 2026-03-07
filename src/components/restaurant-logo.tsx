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

    // Varsayılan logo için tek ama güçlü bir baş harf
    const initial = name.trim().charAt(0).toUpperCase();

    // Modern SaaS Renk Paleti (Zinc & Indigo Accent)
    const bgStart = "#18181b"; // Zinc 900
    const bgEnd = "#09090b";   // Zinc 950
    const accentColor = "#6366f1"; // Indigo 500
    const textColor = "#ffffff";

    return (
        <div
            className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden ${className}`}
            style={{ width: size, height: size }}
        >
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <defs>
                    {/* Yumuşak Köşeli Kare (Squircle) Yolu */}
                    <clipPath id="squircleClip">
                        <path d="M0,50 C0,10 10,0 50,0 C90,0 100,10 100,50 C100,90 90,100 50,100 C10,100 0,90 0,50" />
                    </clipPath>

                    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={bgStart} />
                        <stop offset="100%" stopColor={bgEnd} />
                    </linearGradient>

                    <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
                        <feOffset dx="0" dy="0" result="offsetblur" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.4" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Arkaplan Formu (Squircle) */}
                <path
                    d="M0,50 C0,10 10,0 50,0 C90,0 100,10 100,50 C100,90 90,100 50,100 C10,100 0,90 0,50"
                    fill="url(#bgGrad)"
                />

                {/* Sol Kenar Accent Çizgisi */}
                <rect x="0" y="30" width="3" height="40" rx="1.5" fill={accentColor} fillOpacity="0.8" />

                {/* Baş Harf */}
                <text
                    x="52"
                    y="54"
                    dominantBaseline="central"
                    textAnchor="middle"
                    fill={textColor}
                    filter="url(#textGlow)"
                    style={{
                        fontSize: "52px",
                        fontWeight: 900,
                        fontFamily: "var(--font-heading), 'Inter', 'Outfit', sans-serif",
                        letterSpacing: "-0.04em"
                    }}
                >
                    {initial}
                </text>

                {/* Sağ Üst Dekoratif Nokta */}
                <circle cx="80" cy="20" r="3" fill={accentColor} />
            </svg>
        </div>
    );
}
