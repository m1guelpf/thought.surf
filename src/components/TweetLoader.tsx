import useSWR from 'swr'
import Tweet from './Tweet'
import { TweetDetails } from '@/types/twitter'

const TweetLoader = ({ url, children = null, ...props }) => {
	const { data, error, isLoading } = useSWR<TweetDetails>(
		`https://miguelpiedrafita.com/api/tweet-details?tweet_url=${url}`
	)

	if (error) {
		return (
			<a href={url} target="_blank" rel="noreferrer">
				{children ?? url}
			</a>
		)
	}

	if (isLoading) return null

	return <Tweet tweet={data} {...props} />
}

export default TweetLoader