import { APP_HOST } from './consts'
import { NextApiHandler } from 'next'
import { getIronSession, SessionOptions } from 'iron-session'

const sessionOptions: SessionOptions = {
	password: process.env.APP_KEY,
	ttl: 3600 * 24 * 30, // 1 month
	cookieName: 'thoughtsurf_session',
	cookieOptions: {
		domain: APP_HOST,
		secure: process.env.NODE_ENV === 'production',
	},
}

export const withSession = (handler: NextApiHandler): NextApiHandler => {
	return async (req, res) => {
		const session = await getIronSession(req, res, sessionOptions)

		Object.defineProperty(req, 'session', {
			enumerable: true,
			get: () => session,
			set: value => {
				const keys = Object.keys(value)

				Object.keys(session)
					.filter(key => !keys.includes(key))
					.forEach(key => delete session[key])
				keys.forEach(key => (session[key] = value[key]))
			},
		})

		return handler(req, res)
	}
}
