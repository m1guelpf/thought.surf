import { ethers } from 'ethers'
import { withSession } from '@/lib/session'
import { generateNonce, SiweMessage } from 'siwe'
import { PrismaClient, User } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

export type LoginResponse = { authenticated: boolean; nonce: string | null; user: User | null }

const prisma = new PrismaClient()
const provider = new ethers.providers.InfuraProvider(null, process.env.NEXT_PUBLIC_INFURA_ID)

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method == 'GET') {
		if (req.session.userId) {
			return res.json({
				authenticated: true,
				user: await prisma.user.findUniqueOrThrow({ where: { address: req.session.userId } }),
			} as LoginResponse)
		}

		req.session.nonce = generateNonce()
		await req.session.save()

		return res.status(200).json({ nonce: req.session.nonce, authenticated: false } as LoginResponse)
	}

	if (req.method == 'DELETE') {
		req.session.destroy()
		return res.status(200).end()
	}

	const message = new SiweMessage(req.body.message)
	const {
		data: { address },
	} = await message.verify({ signature: req.body.signature, nonce: req.session.nonce, domain: req.headers.host }, {})

	req.session.nonce = null
	req.session.userId = address
	await req.session.save()

	const user = await prisma.user.findUnique({ where: { address } })

	if (!user) {
		const ensName = await provider.lookupAddress(address)

		await prisma.user.create({
			data: {
				address,
				name: ensName ?? `${address.slice(0, 6)}...${address.slice(-4)}`,
				profile_picture_url: ensName ? await provider.getAvatar(ensName) : null,
			},
		})
	}

	res.status(200).json(user)
}

export default withSession(handler)
