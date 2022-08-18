import { withSession } from '@/lib/session'
import { PrismaClient, User } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

const handler = async (req: NextApiRequest, res: NextApiResponse<User>) => {
	if (req.method != 'PUT') return res.status(405).end()
	if (req.session.userId) return res.status(403).end()

	const user = await prisma.user.update({
		where: { address: req.session.userId },
		data: { name: req.body.name, profile_picture_url: req.body.avatar },
	})

	res.status(200).json(user)
}

export default withSession(handler)
