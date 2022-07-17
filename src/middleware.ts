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

	// `{id}.infinite.camp/` => `/board/{id}`
	if (subdomain) {
		if (url.pathname != '/') return rewriteTo(`/404`, url)

		return rewriteTo(`/board/${subdomain}`, url)
	}

	// `/` => `/board/home`
	if (url.pathname == '/') return rewriteTo(`/board/home`, url)
}

const rewriteTo = (path: string, url: NextURL): NextResponse => {
	url.pathname = path

	return NextResponse.rewrite(url)
}
