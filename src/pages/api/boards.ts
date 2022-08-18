import { withSession } from '@/lib/session'
import { PrismaClient, Room } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

const handler = async (req: NextApiRequest, res: NextApiResponse<Room[]>) => {
	if (!req.session.userId) return res.status(403).end()

	res.json(
		await prisma.room.findMany({
			where: { users: { some: { address: req.session.userId } } },
		})
	)
}

export default withSession(handler)
