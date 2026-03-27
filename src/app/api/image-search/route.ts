import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Server-side image search proxy.
 * Uses DuckDuckGo Image Search (free, no API key required).
 * Falls back to Wikimedia Commons if DuckDuckGo fails.
 */
export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("q");
    if (!query || !query.trim()) {
        return NextResponse.json({ images: [], error: "Query is required" }, { status: 400 });
    }

    const cleanQuery = query.trim();

    // Strategy 1: DuckDuckGo Images (reliable, no key, returns real web images)
    const ddgResult = await searchDuckDuckGo(cleanQuery);
    if (ddgResult.length >= 3) {
        return NextResponse.json({ images: ddgResult, source: "duckduckgo" });
    }

    // Strategy 2: Google Images scraping
    const googleResult = await searchGoogleImages(cleanQuery);
    if (googleResult.length >= 3) {
        return NextResponse.json({ images: googleResult, source: "google" });
    }

    // Strategy 3: Wikimedia Commons (very reliable, usually finds food images)
    const wikiResult = await searchWikimedia(cleanQuery);
    if (wikiResult.length >= 1) {
        return NextResponse.json({ images: wikiResult, source: "wikimedia" });
    }

    // Combine whatever we have
    const combined = [...ddgResult, ...googleResult, ...wikiResult];
    return NextResponse.json({ images: combined, source: "mixed" });
}

async function searchDuckDuckGo(query: string): Promise<string[]> {
    try {
        // Step 1: Get the vqd token from DuckDuckGo
        const initRes = await fetch(
            `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`,
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                    "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                },
                // 8 second timeout
                signal: AbortSignal.timeout(8000),
            }
        );

        if (!initRes.ok) return [];

        const html = await initRes.text();

        // Extract vqd token
        const vqdMatch = html.match(/vqd=['"]([^'"]+)['"]/);
        if (!vqdMatch) return [];
        const vqd = vqdMatch[1];

        // Step 2: Fetch the actual image results
        const imgRes = await fetch(
            `https://duckduckgo.com/i.js?l=tr-tr&o=json&q=${encodeURIComponent(query)}&vqd=${encodeURIComponent(vqd)}&f=,,,,,&p=1`,
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                    "Referer": "https://duckduckgo.com/",
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "Accept-Language": "tr-TR,tr;q=0.9",
                    "X-Requested-With": "XMLHttpRequest",
                },
                signal: AbortSignal.timeout(8000),
            }
        );

        if (!imgRes.ok) return [];

        const data = await imgRes.json();
        if (!data.results || !Array.isArray(data.results)) return [];

        const urls: string[] = data.results
            .slice(0, 15)
            .map((r: any) => r.image)
            .filter((url: any) => typeof url === "string" && url.startsWith("http"));

        return urls;
    } catch (err) {
        console.error("[image-search] DuckDuckGo error:", err);
        return [];
    }
}

async function searchGoogleImages(query: string): Promise<string[]> {
    try {
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&hl=tr&gl=tr&safe=off`;

        const res = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "Accept-Language": "tr-TR,tr;q=0.9",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Referer": "https://www.google.com/",
            },
            signal: AbortSignal.timeout(8000),
        });

        if (!res.ok) return [];
        const html = await res.text();

        const urls: string[] = [];

        // Extract "ou" (original url) from Google's AF_initDataCallback JSON blobs
        const ouPattern = /"ou":"(https?:[^"]+)"/g;
        let match;
        while ((match = ouPattern.exec(html)) !== null && urls.length < 12) {
            try {
                const rawUrl = match[1]
                    .replace(/\\u003d/g, "=")
                    .replace(/\\u0026/g, "&")
                    .replace(/\\/g, "");
                if (rawUrl && rawUrl.startsWith("http") && !rawUrl.includes("google.com")) {
                    urls.push(rawUrl);
                }
            } catch {}
        }

        return urls;
    } catch (err) {
        console.error("[image-search] Google error:", err);
        return [];
    }
}

async function searchWikimedia(query: string): Promise<string[]> {
    try {
        const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&iiprop=url&gsrlimit=12&origin=*`;

        const res = await fetch(wikiUrl, {
            signal: AbortSignal.timeout(8000),
        });

        if (!res.ok) return [];

        const data = await res.json();
        const pages = data.query?.pages || {};
        const urls: string[] = Object.values(pages)
            .map((p: any) => p.imageinfo?.[0]?.url)
            .filter((u): u is string => typeof u === "string" && u.startsWith("http"));

        return urls;
    } catch (err) {
        console.error("[image-search] Wikimedia error:", err);
        return [];
    }
}
