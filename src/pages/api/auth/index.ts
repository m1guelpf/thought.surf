import { withSession } from '@/lib/session'
import { authorize } from '@liveblocks/node'
import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const room = await getRoom(req.body.room, req.session.userId)
	if (!room) return res.status(403).json({})

	const { userId, userInfo } = await getUser(req.session.userId)

	try {
		const result = await authorize({ room, userId, userInfo, secret: process.env.LIVEBLOCKS_KEY })

		return res.status(result.status).end(result.body)
	} catch (error) {
		console.log(error)

		return res.status(500).end()
	}
}

const getRoom = async (name: string, userId: string): Promise<string | false> => {
	const room = await prisma.room.findUnique({
		where: { name },
		select: { is_public: true, liveblocksId: true, users: { select: { address: true } } },
	})

	if (!room?.is_public && !room?.users?.map(user => user.address)?.includes(userId)) return false

	return room.liveblocksId
}

const getUser = async (address: string): Promise<{ userId?: string; userInfo?: Record<string, string> }> => {
	if (!address) return { userId: null, userInfo: {} }

	const user = await prisma.user.findUniqueOrThrow({ where: { address } })

	return {
		userId: user.address,
		userInfo: { name: user.name, avatar: user.profile_picture_url },
	}
}

export default withSession(handler)
