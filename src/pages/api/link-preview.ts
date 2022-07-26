import mql, { MqlResponseData } from '@microlink/mql'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async ({ query: { url } }: NextApiRequest, res: NextApiResponse<MqlResponseData | ''>) => {
	res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400, stale-while-revalidate')
	if (!url) return res.status(404).send('')

	try {
		const { status, data } = await mql(url as string, { screenshot: true })
		if (status == 'fail') return res.status(404).send('')

		res.status(200).json(data)
	} catch {
		res.status(404).send('')
	}
}

export default handler
