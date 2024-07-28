import { getTweet, Tweet } from 'react-tweet/api'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async ({ query: { url } }: NextApiRequest, res: NextApiResponse<Tweet | null>) => {
	res.setHeader('Cache-Control', 'max-age=86400, s-maxage=86400, stale-while-revalidate')
	if (!url) return res.status(404).end()

	const id = (url as string).split('/').pop()

	const tweet = await getTweet(id as string)
	if (!tweet) return res.status(404).send(null)

	res.status(200).json(tweet)
}

export default handler
