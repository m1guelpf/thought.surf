import { withSession } from '@/lib/session'
import { authorize } from '@liveblocks/node'
import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

const handler = async ({ body: { room }, session }: NextApiRequest, res: NextApiResponse) => {
	// @TODO: Hook in a database and support multiple rooms
	if (room != 'home') return res.status(403).json({})

	let userInfo
	if (session.userId) {
		const user = await prisma.user.findUnique({ where: { address: session.userId } })

		userInfo = {
			name: user.name,
			avatar: user.profile_picture_url,
		}
	}

	try {
		const result = await authorize({
			room,
			userInfo,
			userId: session.userId,
			secret: process.env.LIVEBLOCKS_KEY,
		})

		return res.status(result.status).end(result.body)
	} catch (error) {
		console.log(error)

		return res.status(500).end()
	}
}

export default withSession(handler)
