import mql, { MqlPayload } from '@microlink/mql'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (
	{ query: { url, screenshot, video, embed } }: NextApiRequest,
	res: NextApiResponse<MqlPayload['data'] | ''>
) => {
	res.setHeader('Cache-Control', 'max-age=86400, s-maxage=86400, stale-while-revalidate')
	if (!url) return res.status(404).send('')

	try {
		const { status, data } = await mql(url as string, {
			video: !!video,
			iframe: !!embed,
			screenshot: !!screenshot,
			// apiKey: process.env.MICROLINK_KEY,
		})
		if (status == 'fail') return res.status(404).send('')

		res.status(200).json(data)
	} catch (error) {
		if (error.statusCode === 429) res.setHeader('Retry-After', error.headers['x-rate-limit-reset'])

		res.status(error.statusCode).send('')
	}
}

export default handler
