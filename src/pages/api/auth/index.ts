import { withSession } from '@/lib/session'
import { PrismaClient } from '@prisma/client'
import { Liveblocks } from '@liveblocks/node'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()
const liveblocks = new Liveblocks({ secret: process.env.LIVEBLOCKS_KEY })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const room = await getRoom(req.body.room, req.session.userId)
	if (!room) return res.status(403).json({})

	const { userId, userInfo } = await getUser(req.session.userId)
    if (!userId) return res.status(403).json({})

	const session = await liveblocks.prepareSession(userId, { userInfo })
	session.allow(room, session.FULL_ACCESS)

	const { body, status, error } = await session.authorize()

	if (error) console.log(error)
	return res.status(status).end(body)
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
