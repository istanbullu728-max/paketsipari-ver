import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("q");
    if (!query || !query.trim()) {
        return NextResponse.json({ images: [], error: "Query is required" }, { status: 400 });
    }

    const cleanQuery = query.trim();

    // Run all search strategies in parallel, take whichever returns first with results
    const [ddgResult, wikiResult, googleResult] = await Promise.allSettled([
        searchDuckDuckGo(cleanQuery),
        searchWikimedia(cleanQuery),
        searchGoogleImages(cleanQuery),
    ]);

    const ddg = ddgResult.status === "fulfilled" ? ddgResult.value : [];
    const wiki = wikiResult.status === "fulfilled" ? wikiResult.value : [];
    const google = googleResult.status === "fulfilled" ? googleResult.value : [];

    // Merge and deduplicate, prioritize Google, then DDG
    const seen = new Set<string>();
    const combined: string[] = [];

    // Prioritize Google results first as requested
    for (const url of [...google, ...ddg, ...wiki]) {
        if (!seen.has(url) && combined.length < 24) {
            seen.add(url);
            combined.push(url);
        }
    }

    const source = google.length > 0 ? "google" : ddg.length > 0 ? "duckduckgo" : "wikimedia";

    return NextResponse.json({
        images: combined,
        source,
        counts: { google: google.length, duckduckgo: ddg.length, wikimedia: wiki.length },
    });
}

async function searchDuckDuckGo(query: string): Promise<string[]> {
    try {
        // Get home page to extract vqd token
        const homeRes = await fetch(
            `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`,
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                    "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Cache-Control": "no-cache",
                },
                signal: AbortSignal.timeout(7000),
            }
        );

        if (!homeRes.ok) return [];
        const html = await homeRes.text();

        // Multiple vqd extraction patterns
        let vqd = "";
        const patterns = [
            /vqd=['"]([^'"]{10,})['"]/,
            /vqd=([0-9-]+)/,
            /"vqd":"([^"]+)"/,
            /vqd: ['"]([^'"]+)['"]/,
        ];
        for (const pattern of patterns) {
            const m = html.match(pattern);
            if (m) { vqd = m[1]; break; }
        }

        if (!vqd) {
            console.warn("[ddg] Could not extract vqd token");
            return [];
        }

        // Fetch image results
        const imgRes = await fetch(
            `https://duckduckgo.com/i.js?l=tr-tr&o=json&q=${encodeURIComponent(query)}&vqd=${encodeURIComponent(vqd)}&f=,,,,,&p=1`,
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                    "Referer": "https://duckduckgo.com/",
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "Accept-Language": "tr-TR,tr;q=0.9",
                    "X-Requested-With": "XMLHttpRequest",
                },
                signal: AbortSignal.timeout(7000),
            }
        );

        if (!imgRes.ok) return [];

        const data = await imgRes.json();
        if (!data?.results?.length) return [];

        return data.results
            .slice(0, 12)
            .map((r: any) => r.image)
            .filter((u: any) => typeof u === "string" && u.startsWith("http"));
    } catch (err) {
        console.error("[ddg]", (err as Error).message);
        return [];
    }
}

async function searchGoogleImages(query: string): Promise<string[]> {
    try {
        const searchUrls = [
            `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&hl=tr&gl=tr&safe=off`,
            `https://www.google.com/search?q=${encodeURIComponent(query)}&udm=2&hl=tr&gl=tr&safe=off`,
            `https://www.google.com/search?q=${encodeURIComponent(query)}+yemek&tbm=isch&hl=tr&gl=tr`
        ];

        for (const url of searchUrls) {
            const res = await fetch(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
                    "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
                    "Referer": "https://www.google.com/",
                },
                signal: AbortSignal.timeout(6000),
            });

            if (!res.ok) continue;
            const html = await res.text();
            const urls: string[] = [];

            // Pattern 1: High-res JSON structure
            const jsonPattern = /\["(https?:\/\/[^"]+)",\s*(\d+),\s*(\d+)\]/g;
            let match;
            while ((match = jsonPattern.exec(html)) !== null && urls.length < 20) {
                let u = match[1].replace(/\\u003d/g, "=").replace(/\\u0026/g, "&").replace(/\\\//g, "/");
                if (u.startsWith("http") && !u.includes("gstatic") && !u.includes("google.com/search")) {
                    if (!urls.includes(u)) urls.push(u);
                }
            }

            // Pattern 2: data-src or data-iurl (often found in newer Google layouts)
            if (urls.length < 10) {
                const attrPattern = /(?:data-src|data-iurl)="([^"]+)"/g;
                while ((match = attrPattern.exec(html)) !== null && urls.length < 20) {
                    const u = match[1];
                    if (u.startsWith("http") && !u.includes("google") && !u.includes("gstatic")) {
                        if (!urls.includes(u)) urls.push(u);
                    }
                }
            }

            // Pattern 3: Simple img src for basic mobile/bot views
            if (urls.length < 5) {
                const imgPattern = /<img[^>]+src="([^"]+)"/g;
                while ((match = imgPattern.exec(html)) !== null && urls.length < 20) {
                    const u = match[1];
                    if (u.startsWith("http") && !u.includes("google") && !u.includes("gstatic")) {
                        if (!urls.includes(u)) urls.push(u);
                    }
                }
            }

            if (urls.length > 5) return urls;
        }
        return [];
    } catch (err) {
        console.error("[google]", (err as Error).message);
        return [];
    }
}

async function searchWikimedia(query: string): Promise<string[]> {
    try {
        const res = await fetch(
            `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&iiprop=url&gsrlimit=15&iiurlwidth=600&origin=*`,
            { signal: AbortSignal.timeout(6000) }
        );

        if (!res.ok) return [];
        const data = await res.json();
        const pages = data.query?.pages || {};

        return Object.values(pages)
            .map((p: any) => p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url)
            .filter((u): u is string => typeof u === "string" && u.startsWith("http"))
            .slice(0, 12);
    } catch (err) {
        console.error("[wikimedia]", (err as Error).message);
        return [];
    }
}
