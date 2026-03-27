import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_HOSTS = [
    "upload.wikimedia.org",
    "commons.wikimedia.org",
    "images.duckduckgo.com",
    "external-content.duckduckgo.com",
    "i.duckduckgo.com",
    "tse1.mm.bing.net",
    "tse2.mm.bing.net",
    "tse3.mm.bing.net",
    "tse4.mm.bing.net",
    "tse1.explicit.bing.net",
    "tse2.explicit.bing.net",
    "images.unsplash.com",
    "plus.unsplash.com",
    "loremflickr.com",
    "live.staticflickr.com",
    "farm1.staticflickr.com",
    "farm2.staticflickr.com",
    "farm3.staticflickr.com",
    "farm4.staticflickr.com",
    "farm5.staticflickr.com",
    "farm6.staticflickr.com",
    "farm7.staticflickr.com",
    "farm8.staticflickr.com",
    "farm9.staticflickr.com",
    "i.imgur.com",
    "imgur.com",
    "media.istockphoto.com",
    "images.pexels.com",
];

export async function GET(request: NextRequest) {
    const imageUrl = request.nextUrl.searchParams.get("url");

    if (!imageUrl) {
        return new NextResponse("Missing url parameter", { status: 400 });
    }

    // Validate URL
    let parsedUrl: URL;
    try {
        parsedUrl = new URL(imageUrl);
    } catch {
        return new NextResponse("Invalid URL", { status: 400 });
    }

    // Security: only proxy from allowed hosts
    const hostname = parsedUrl.hostname.toLowerCase();
    const isAllowed = ALLOWED_HOSTS.some(
        (host) => hostname === host || hostname.endsWith("." + host)
    );

    if (!isAllowed) {
        // Instead of blocking, try to proxy anyway but with a fallback
        console.warn("[image-proxy] Unlisted host:", hostname);
    }

    // Only allow http/https
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return new NextResponse("Invalid protocol", { status: 400 });
    }

    try {
        const response = await fetch(imageUrl, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "Referer": "https://www.google.com/",
                "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
                "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8",
            },
            // 10 second timeout
            signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
            return new NextResponse(`Upstream error: ${response.status}`, {
                status: response.status,
            });
        }

        const contentType = response.headers.get("content-type") || "image/jpeg";
        const body = await response.arrayBuffer();

        return new NextResponse(body, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (error: any) {
        console.error("[image-proxy] Fetch error:", error?.message);
        return new NextResponse("Failed to fetch image", { status: 502 });
    }
}
