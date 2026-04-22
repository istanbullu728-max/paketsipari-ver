import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("q");
    if (!query || !query.trim()) {
        return NextResponse.json({ images: [], error: "Query is required" }, { status: 400 });
    }

    const cleanQuery = query.trim();

    try {
        // Parallel search with aggressive error handling
        const [googleRes, ddgRes, yandexRes] = await Promise.allSettled([
            searchGoogleImages(cleanQuery),
            searchDuckDuckGo(cleanQuery),
            searchYandexImages(cleanQuery)
        ]);

        const google = googleRes.status === "fulfilled" ? googleRes.value : [];
        const ddg = ddgRes.status === "fulfilled" ? ddgRes.value : [];
        const yandex = yandexRes.status === "fulfilled" ? yandexRes.value : [];

        // Log results for debugging
        console.log(`Search: "${cleanQuery}" -> G:${google.length}, D:${ddg.length}, Y:${yandex.length}`);

        // Merge results: Prioritize high-quality results from any source
        const seen = new Set<string>();
        const combined: string[] = [];

        // Mix sources to ensure we have something even if Google is blocked
        const maxLength = Math.max(google.length, ddg.length, yandex.length);
        for (let i = 0; i < maxLength; i++) {
            if (google[i] && !seen.has(google[i])) { seen.add(google[i]); combined.push(google[i]); }
            if (ddg[i] && !seen.has(ddg[i])) { seen.add(ddg[i]); combined.push(ddg[i]); }
            if (yandex[i] && !seen.has(yandex[i])) { seen.add(yandex[i]); combined.push(yandex[i]); }
            if (combined.length >= 50) break;
        }

        return NextResponse.json({
            images: combined,
            counts: { google: google.length, ddg: ddg.length, yandex: yandex.length },
            success: combined.length > 0
        });
    } catch (error: any) {
        console.error("Hybrid Search Error:", error);
        return NextResponse.json({ images: [], error: "Search failed" }, { status: 500 });
    }
}

async function searchGoogleImages(query: string): Promise<string[]> {
    try {
        // Using tbm=isch (classic image search) with a very modern mobile/desktop UA mix
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&hl=tr&gl=tr`;
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
                "Referer": "https://www.google.com/",
                "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
            },
            signal: AbortSignal.timeout(5000),
        });

        if (!res.ok) return [];
        const html = await res.text();
        const urls: string[] = [];

        // Robust Pattern 1: Encrypted thumbnails (very stable fallback)
        const thumbMatches = html.matchAll(/"(https:\/\/encrypted-tbn0\.gstatic\.com\/images\?q=tbn:[^"]+)"/g);
        for (const m of thumbMatches) {
            if (!urls.includes(m[1])) urls.push(m[1]);
        }

        // Robust Pattern 2: Regular image URLs from the JSON blobs
        // Google encodes full URLs in various script blocks
        const imgMatches = html.matchAll(/"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))",\d+,\d+/g);
        for (const m of imgMatches) {
            const u = m[1];
            if (!u.includes('google.com') && !u.includes('gstatic.com') && !urls.includes(u)) {
                urls.push(u);
            }
        }

        return urls;
    } catch { return []; }
}

async function searchDuckDuckGo(query: string): Promise<string[]> {
    try {
        // DDG requires a VQD token first
        const homeRes = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" },
            signal: AbortSignal.timeout(5000)
        });
        const homeHtml = await homeRes.text();
        const vqdMatch = homeHtml.match(/vqd=['"]([^'"]+)['"]/);
        if (!vqdMatch) return [];

        // Now call the JSON API
        const imgRes = await fetch(`https://duckduckgo.com/i.js?l=tr-tr&o=json&q=${encodeURIComponent(query)}&vqd=${vqdMatch[1]}&f=,,,,,&p=1`, {
            headers: { 
                "Referer": "https://duckduckgo.com/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            },
            signal: AbortSignal.timeout(5000)
        });
        
        const data = await imgRes.json();
        return (data.results || [])
            .map((r: any) => r.image)
            .filter((u: string) => u && u.startsWith("http"));
    } catch { return []; }
}

async function searchYandexImages(query: string): Promise<string[]> {
    try {
        const url = `https://yandex.com/images/search?text=${encodeURIComponent(query)}&lr=11508`;
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
                "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
            },
            signal: AbortSignal.timeout(5000)
        });
        if (!res.ok) return [];
        const html = await res.text();
        
        const urls: string[] = [];
        // Yandex uses "img_url":"..." in its JSON blocks
        const matches = html.matchAll(/"img_url":"([^"]+)"/g);
        for (const m of matches) {
            const u = decodeURIComponent(m[1].replace(/\\u0026/g, "&"));
            if (u.startsWith("http") && !urls.includes(u)) {
                urls.push(u);
            }
            if (urls.length >= 30) break;
        }
        return urls;
    } catch { return []; }
}
