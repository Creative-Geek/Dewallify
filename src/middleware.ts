import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting configuration using a rolling window
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 5 // Maximum requests per window
const WINDOW_SIZE = 1000 // Store timestamps for more accurate rate limiting
const ipRequestMap = new Map<string, number[]>()

// Security headers
const securityHeaders = {
    'X-DNS-Prefetch-Control': 'off',
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}

export async function middleware(request: NextRequest) {
    // Only apply to API routes
    if (!request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.next()
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        'unknown'

    const now = Date.now()
    const requestData = ipRequestMap.get(ip)

    // Get existing timestamps for this IP
    let timestamps = requestData || []

    // Remove timestamps outside the current window
    timestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW)

    if (timestamps.length >= MAX_REQUESTS) {
        const oldestRequest = Math.min(...timestamps)
        const resetTime = oldestRequest + RATE_LIMIT_WINDOW
        const waitTime = Math.ceil((resetTime - now) / 1000)

        return new NextResponse(
            JSON.stringify({ error: 'Too many requests' }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': waitTime.toString(),
                    'X-RateLimit-Limit': MAX_REQUESTS.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString()
                }
            }
        )
    }

    // Add current timestamp and update the map
    timestamps.push(now)
    ipRequestMap.set(ip, timestamps)

    // Add rate limit headers to successful responses
    const remaining = MAX_REQUESTS - timestamps.length

    // Add security headers
    const response = NextResponse.next()
    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
    })

    response.headers.set('X-RateLimit-Limit', MAX_REQUESTS.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', Math.ceil((now + RATE_LIMIT_WINDOW) / 1000).toString())

    return response
}

// Clean up old rate limit entries periodically
setInterval(() => {
    const now = Date.now()
    for (const [ip, timestamps] of ipRequestMap.entries()) {
        const validTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW)
        if (validTimestamps.length === 0) {
            ipRequestMap.delete(ip)
        } else {
            ipRequestMap.set(ip, validTimestamps)
        }
    }
}, RATE_LIMIT_WINDOW)

export const config = {
    matcher: '/api/:path*'
}