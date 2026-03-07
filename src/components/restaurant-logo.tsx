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

    // Varsayılan logo için baş harf ve isim temizleme
    const initial = name.trim().charAt(0).toUpperCase();

    // Şık renk paleti (Antrasit / Koyu Lacivert tonları)
    const bgColor = "#1e1e2e"; // Koyu antrasit/lacivert mystery
    const textColor = "#ffffff";
    const accentColor = "#10b981"; // Emerald accent for a touch of life

    return (
        <div
            className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-full shadow-sm bg-zinc-900 ${className}`}
            style={{ width: size, height: size }}
        >
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                {/* Arkaplan Gradiyenti */}
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                </defs>

                <circle cx="50" cy="50" r="50" fill="url(#logoGradient)" />

                {/* Dekoratif Çember */}
                <circle cx="50" cy="50" r="46" stroke={accentColor} strokeWidth="1" strokeOpacity="0.3" fill="none" />

                {/* Baş Harf */}
                <text
                    x="50"
                    y="50"
                    dominantBaseline="central"
                    textAnchor="middle"
                    fill={textColor}
                    style={{
                        fontSize: "44px",
                        fontWeight: 800,
                        fontFamily: "var(--font-heading), 'Inter', sans-serif",
                        letterSpacing: "-0.02em"
                    }}
                >
                    {initial}
                </text>

                {/* Alt dekoratif çizgi veya detay */}
                <rect x="40" y="72" width="20" height="2" rx="1" fill={accentColor} />
            </svg>
        </div>
    );
}
