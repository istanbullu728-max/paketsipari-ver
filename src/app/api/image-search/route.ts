import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("q");
    if (!query || !query.trim()) {
        return NextResponse.json({ images: [], error: "Query is required" }, { status: 400 });
    }

    const cleanQuery = query.trim();

    // Parallel search strategy
    // We try Google first but ensure fallbacks (DDG, Yandex) provide results if Google blocks us
    try {
        const [googleRes, ddgRes, yandexRes] = await Promise.allSettled([
            searchGoogleImages(cleanQuery),
            searchDuckDuckGo(cleanQuery),
            searchYandexImages(cleanQuery)
        ]);

        const google = googleRes.status === "fulfilled" ? googleRes.value : [];
        const ddg = ddgRes.status === "fulfilled" ? ddgRes.value : [];
        const yandex = yandexRes.status === "fulfilled" ? yandexRes.value : [];

        // Merge results: Prioritize diversity and high resolution
        const seen = new Set<string>();
        const combined: string[] = [];

        // Mixing logic: 1 from each source recursively to ensure variety
        const maxLength = Math.max(google.length, ddg.length, yandex.length);
        for (let i = 0; i < maxLength; i++) {
            if (google[i] && !seen.has(google[i])) { seen.add(google[i]); combined.push(google[i]); }
            if (ddg[i] && !seen.has(ddg[i])) { seen.add(ddg[i]); combined.push(ddg[i]); }
            if (yandex[i] && !seen.has(yandex[i])) { seen.add(yandex[i]); combined.push(yandex[i]); }
            if (combined.length >= 40) break;
        }

        return NextResponse.json({
            images: combined,
            source: google.length > 0 ? "google-hybrid" : "meta-search",
            counts: { google: google.length, ddg: ddg.length, yandex: yandex.length }
        });
    } catch (error: any) {
        console.error("Hybrid Search Error:", error);
        return NextResponse.json({ images: [], error: "Search failed" }, { status: 500 });
    }
}

async function searchGoogleImages(query: string): Promise<string[]> {
    try {
        // We use the new Image Search format (udm=2) as it's currently more stable
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&udm=2&hl=tr&gl=tr`;
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
                "Referer": "https://www.google.com/",
            },
            signal: AbortSignal.timeout(4000),
        });

        if (!res.ok) return [];
        const html = await res.text();
        const urls: string[] = [];

        // Pattern for modern Google Image grid data
        const attrPattern = /(?:data-src|data-iurl)="([^"]+)"/g;
        let match;
        while ((match = attrPattern.exec(html)) !== null && urls.length < 20) {
            if (match[1].startsWith("http") && !match[1].includes("google")) {
                urls.push(match[1]);
            }
        }

        return urls;
    } catch { return []; }
}

async function searchDuckDuckGo(query: string): Promise<string[]> {
    try {
        // Step 1: Get VQD token
        const homeRes = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" },
            signal: AbortSignal.timeout(4000)
        });
        const homeHtml = await homeRes.text();
        const vqdMatch = homeHtml.match(/vqd=['"]([^'"]+)['"]/);
        if (!vqdMatch) return [];

        // Step 2: Get Images JSON
        const imgRes = await fetch(`https://duckduckgo.com/i.js?l=tr-tr&o=json&q=${encodeURIComponent(query)}&vqd=${vqdMatch[1]}&f=,,,,,&p=1`, {
            headers: { "Referer": "https://duckduckgo.com/", "User-Agent": "Mozilla/5.0" },
            signal: AbortSignal.timeout(4000)
        });
        const data = await imgRes.json();
        return (data.results || []).map((r: any) => r.image).filter((u: string) => u.startsWith("http"));
    } catch { return []; }
}

async function searchYandexImages(query: string): Promise<string[]> {
    try {
        const url = `https://yandex.com/images/search?text=${encodeURIComponent(query)}`;
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
                "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
            },
            signal: AbortSignal.timeout(5000)
        });
        if (!res.ok) return [];
        const html = await res.text();
        
        // Yandex results are in JSON blocks inside data-bem attributes
        const urls: string[] = [];
        const matches = html.matchAll(/"img_url":"([^"]+)"/g);
        for (const m of matches) {
            const u = decodeURIComponent(m[1].replace(/\\u0026/g, "&"));
            if (u.startsWith("http") && !urls.includes(u)) {
                urls.push(u);
            }
            if (urls.length >= 25) break;
        }
        return urls;
    } catch { return []; }
}
