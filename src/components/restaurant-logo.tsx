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

    // Varsayılan logo tasarımı: Cloche (Gümüş Kapak) + Tipografi
    const restaurantName = name || "Restoran";

    // Renk Paleti
    const maroon = "#A31D1D"; // İkon ve alt yazı rengi
    const darkGray = "#1A1A1A"; // Restoran adı rengi

    return (
        <div
            className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
            style={{ width: size, height: size }}
        >
            <svg
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                {/* --- CLOCHE ICON --- */}
                <g transform="translate(50, 20)">
                    {/* Handle */}
                    <circle cx="50" cy="15" r="7" fill={maroon} />

                    {/* Dome */}
                    <path d="M10,65 C10,35 30,22 50,22 C70,22 90,35 90,65 L10,65 Z" fill={maroon} />

                    {/* Base Layers */}
                    <rect x="5" y="68" width="90" height="6" fill={maroon} />
                    <rect x="0" y="77" width="100" height="3" fill={maroon} />

                    {/* Steam Elements */}
                    <path d="M100,5 C105,15 95,25 100,35" stroke={maroon} strokeWidth="3" strokeLinecap="round" strokeOpacity="0.7" fill="none" />
                    <path d="M110,15 C115,25 105,35 110,45" stroke={maroon} strokeWidth="3" strokeLinecap="round" strokeOpacity="0.7" fill="none" />
                    <path d="M92,-5 C97,5 87,15 92,25" stroke={maroon} strokeWidth="3" strokeLinecap="round" strokeOpacity="0.7" fill="none" />
                </g>

                {/* --- TEXT SECTION --- */}
                {/* Restaurant Name (Serif) */}
                <text
                    x="100"
                    y="135"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill={darkGray}
                    textLength={restaurantName.length > 2 ? "180" : undefined}
                    lengthAdjust="spacingAndGlyphs"
                    style={{
                        fontSize: restaurantName.length > 15 
                            ? "20px" 
                            : restaurantName.length > 10 
                                ? "26px" 
                                : "32px",
                        fontWeight: 400,
                        fontFamily: "'Times New Roman', serif",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase"
                    }}
                >
                    {restaurantName}
                </text>

                {/* "restoran" sublabel (Sans-serif) */}
                <text
                    x="100"
                    y="165"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill={maroon}
                    style={{
                        fontSize: "18px",
                        fontWeight: 500,
                        fontFamily: "'Inter', 'Segoe UI', sans-serif",
                        letterSpacing: "0.2em",
                    }}
                >
                    restoran
                </text>
            </svg>
        </div>
    );
}
