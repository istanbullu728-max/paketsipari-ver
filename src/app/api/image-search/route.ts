import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("q");
    if (!query || !query.trim()) {
        return NextResponse.json({ images: [], error: "Query is required" }, { status: 400 });
    }

    const cleanQuery = query.trim();

    // Use multiple queries in parallel to get diverse and high-quality results from Google
    const queries = [
        cleanQuery,                           // Exact product name
        `${cleanQuery} yemek`,               // Focused on Turkish food context
        `${cleanQuery} food photography`     // Focused on professional quality
    ];

    try {
        const results = await Promise.all(
            queries.map(q => searchGoogleImages(q))
        );

        // Flatten, deduplicate, and filter
        const combined = Array.from(new Set(results.flat()))
            .filter(url => 
                url.startsWith("http") && 
                !url.includes("gstatic.com") && 
                !url.includes("google.com") &&
                !url.includes("lookaside.fbsbx.com") // Filter out low-res social media thumbs
            )
            .slice(0, 30);

        return NextResponse.json({
            images: combined,
            source: "google",
            count: combined.length
        });
    } catch (error: any) {
        console.error("Master Search Error:", error);
        return NextResponse.json({ images: [], error: "Search failed" }, { status: 500 });
    }
}

async function searchGoogleImages(query: string): Promise<string[]> {
    const searchUrls = [
        // Variant 1: Standard Desktop Search
        {
            url: `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&hl=tr&gl=tr&safe=off`,
            ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
        },
        // Variant 2: New Google "Lens-style" Search (udm=2)
        {
            url: `https://www.google.com/search?q=${encodeURIComponent(query)}&udm=2&hl=tr&gl=tr`,
            ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
        }
    ];

    const allUrls: string[] = [];

    for (const search of searchUrls) {
        try {
            const res = await fetch(search.url, {
                headers: {
                    "User-Agent": search.ua,
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                    "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
                    "Referer": "https://www.google.com/",
                },
                signal: AbortSignal.timeout(5000),
            });

            if (!res.ok) continue;
            const html = await res.text();
            
            // Layer 1: JSON Data extraction (AF_initDataCallback)
            // This contains high-resolution original image URLs
            const jsonPattern = /\["(https?:\/\/[^"]+)",\s*(\d+),\s*(\d+)\]/g;
            let match;
            while ((match = jsonPattern.exec(html)) !== null && allUrls.length < 40) {
                let u = match[1].replace(/\\u003d/g, "=").replace(/\\u0026/g, "&").replace(/\\\//g, "/");
                if (isValidImageUrl(u)) {
                    if (!allUrls.includes(u)) allUrls.push(u);
                }
            }

            // Layer 2: data-src / data-iurl attributes
            if (allUrls.length < 15) {
                const attrPattern = /(?:data-src|data-iurl)="([^"]+)"/g;
                while ((match = attrPattern.exec(html)) !== null && allUrls.length < 40) {
                    const u = match[1];
                    if (isValidImageUrl(u) && !allUrls.includes(u)) allUrls.push(u);
                }
            }

            // Layer 3: Direct img src (Mobile fallback style)
            if (allUrls.length < 10) {
                const imgPattern = /<img[^>]+src="([^"]+)"/g;
                while ((match = imgPattern.exec(html)) !== null && allUrls.length < 40) {
                    const u = match[1];
                    if (isValidImageUrl(u) && !allUrls.includes(u)) allUrls.push(u);
                }
            }

            if (allUrls.length > 10) break; // Found enough for this query variant
        } catch (err) {
            console.warn(`[google-scrape] Failed variant for: ${query}`, (err as Error).message);
        }
    }

    return allUrls;
}

function isValidImageUrl(url: string): boolean {
    if (!url || typeof url !== "string") return false;
    if (!url.startsWith("http")) return false;
    
    const forbidden = ["gstatic.com", "google.com", "googleusercontent.com", "favicon", "logo", "icon", "pixel"];
    if (forbidden.some(f => url.includes(f))) return false;
    
    return true;
}
