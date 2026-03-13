"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";

interface Props {
    address: string;
    onChange: (address: string, lat: number, lng: number) => void;
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { "Accept-Language": "tr" } }
        );
        const data = await res.json();
        return data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    } catch {
        return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
}

async function forwardGeocode(query: string): Promise<{ lat: number; lng: number } | null> {
    const trySearch = async (q: string) => {
        try {
            let cleanQuery = q.replace(/\n/g, ", ").trim();
            if (!cleanQuery) return null;
            
            // Append Turkey to stay in context
            if (!cleanQuery.toLowerCase().includes("türkiye") && !cleanQuery.toLowerCase().includes("turkey")) {
                cleanQuery += ", Türkiye";
            }
            
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanQuery)}&format=json&limit=1`,
                { headers: { "Accept-Language": "tr" } }
            );
            const results = await res.json();
            if (results && results.length > 0) {
                return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
            }
            return null;
        } catch {
            return null;
        }
    };

    // 1. Try full query
    let result = await trySearch(query);
    if (result) return result;

    // 2. If fails, try stripping specific details like "No:", "Kapı", "Daire" which Nominatim hates
    const simplified = query
        .replace(/(No|Kapi|Daire|Kat|Blok|Sitesi|Apartmani|Apt|P\.\s*K).*$/gi, '')
        .trim();
    
    if (simplified && simplified !== query) {
        result = await trySearch(simplified);
        if (result) return result;
    }

    // 3. Last resort: try just the first 3-4 words (usually Neighborhood/Street)
    const words = query.split(/[\s,]+/).filter(w => w.length > 2);
    if (words.length > 3) {
        result = await trySearch(words.slice(0, 4).join(" "));
    }

    return result;
}

export default function MapAddressPicker({ address, onChange }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const initializedRef = useRef(false);

    // Promise that resolves once the Leaflet map is fully ready
    const mapReadyResolve = useRef<() => void>(() => { });
    const mapReadyPromise = useRef<Promise<void>>(
        new Promise(resolve => { mapReadyResolve.current = resolve; })
    );

    // Always reflect the very latest address in a ref (avoid stale closures)
    const latestAddressRef = useRef(address);
    const [loading, setLoading] = useState(false);

    useEffect(() => { latestAddressRef.current = address; }, [address]);

    // ── Initialize Leaflet once the container div is in the DOM ─────────
    useEffect(() => {
        if (initializedRef.current || !containerRef.current) return;
        initializedRef.current = true;

        const init = async () => {
            const L = (await import("leaflet")).default;

            // Fix Webpack-broken default marker icons
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            const DEFAULT_LAT = 38.9637;
            const DEFAULT_LNG = 35.2433;

            const map = L.map(containerRef.current!, {
                center: [DEFAULT_LAT, DEFAULT_LNG],
                zoom: 6,
                zoomControl: true,
                scrollWheelZoom: true,
            });

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '© <a href="https://www.openstreetmap.org">OpenStreetMap</a>',
                maxZoom: 19,
            }).addTo(map);

            const marker = L.marker([DEFAULT_LAT, DEFAULT_LNG], { draggable: true }).addTo(map);

            const onPinChange = async (lat: number, lng: number) => {
                setLoading(true);
                marker.setLatLng([lat, lng]);
                map.panTo([lat, lng], { animate: true });
                const addr = await reverseGeocode(lat, lng);
                onChange(addr, lat, lng);
                setLoading(false);
            };

            map.on("click", (e: any) => onPinChange(e.latlng.lat, e.latlng.lng));
            marker.on("dragend", () => {
                const { lat, lng } = marker.getLatLng();
                onPinChange(lat, lng);
            });

            mapRef.current = map;
            markerRef.current = marker;

            // Let browser finish painting before measuring container
            setTimeout(() => {
                map.invalidateSize();
                // Signal that the map is ready for geocode requests
                mapReadyResolve.current();
            }, 150);
        };

        init();

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markerRef.current = null;
                initializedRef.current = false;
                // Reset the promise for next mount
                mapReadyPromise.current = new Promise(resolve => {
                    mapReadyResolve.current = resolve;
                });
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Forward-geocode whenever address text changes ─────────────────────
    useEffect(() => {
        if (!address || address.length < 6) return;

        // Debounce 900 ms, then wait for map to be ready before moving pin
        const timer = setTimeout(async () => {
            const snapshot = latestAddressRef.current;
            
            // Allow bypassing map ready promise if geocoding first, wait to move until map is there
            try {
                setLoading(true);
                const result = await forwardGeocode(snapshot);
                
                await mapReadyPromise.current;

                if (!mapRef.current || !markerRef.current) return;
                
                // If the user continued typing, abort this outdated request
                if (latestAddressRef.current !== snapshot) return;

                if (result) {
                    // Check if current pin is far from result to avoid loops
                    const currentPos = markerRef.current.getLatLng();
                    const distance = Math.pow(currentPos.lat - result.lat, 2) + Math.pow(currentPos.lng - result.lng, 2);
                    if (distance > 0.000001) {
                         markerRef.current.setLatLng([result.lat, result.lng]);
                         mapRef.current.setView([result.lat, result.lng], 15, { animate: true });
                    }
                }
            } catch (e) {
                console.error("Geocoding failed", e);
            } finally {
                setLoading(false);
            }
        }, 900);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    return (
        <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm bg-zinc-100 dark:bg-zinc-900">
            {/* Fixed pixel height — Leaflet MUST have an explicit height */}
            <div
                ref={containerRef}
                style={{ height: "220px", width: "100%" }}
            />

            {/* Floating hint */}
            <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 z-[999]">
                <div className="bg-black/60 backdrop-blur-sm text-white text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5 whitespace-nowrap shadow-lg">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    Haritaya tıklayın ya da pini sürükleyin
                </div>
            </div>

            {/* Loading overlay during geocoding */}
            {loading && (
                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-[1000]">
                    <div className="bg-white dark:bg-zinc-900 rounded-full p-2 shadow-lg">
                        <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                    </div>
                </div>
            )}
        </div>
    );
}
