/* eslint-disable @next/next/no-server-import-in-page */
import { NextResponse } from 'next/server'
import { getSubdomain } from './lib/utils'
import type { NextRequest } from 'next/server'
import { NextURL } from 'next/dist/server/web/next-url'

export const config = {
	matcher: ['/', '/board/:path*'],
}

export default function middleware(req: NextRequest) {
	const url = req.nextUrl
	const subdomain = getSubdomain(req.headers.get('host'))

	if (subdomain) return rewriteTo(`/404`, url)
}

const rewriteTo = (path: string, url: NextURL): NextResponse => {
	url.pathname = path

	return NextResponse.rewrite(url)
}
