import { authorize } from '@liveblocks/node'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async ({ body: { room } }: NextApiRequest, res: NextApiResponse) => {
	// @TODO: Hook in a database and support multiple rooms
	if (room != 'home') return res.status(403).json({})

	const result = await authorize({
		room,
		secret: process.env.LIVEBLOCKS_KEY,
	})

	return res.status(result.status).end(result.body)
}

export default handler
