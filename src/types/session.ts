import { IronSession, IronSessionData } from 'iron-session'

declare module 'iron-session' {
	interface IronSessionData {
		nonce?: string
		userId?: string
	}
}

declare module 'next' {
	interface NextApiRequest {
		session: IronSession<IronSessionData>
	}
}

export {}
