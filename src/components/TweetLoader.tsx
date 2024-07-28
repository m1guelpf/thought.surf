import Tweet from './Tweet'
import useSWRImmutable from 'swr/immutable'
import { TweetDetails } from '@/types/twitter'

const TweetLoader = ({ url, children = null, ...props }) => {
	const { data, error, isLoading } = useSWRImmutable<TweetDetails>(`/api/tweet-details?url=${url}`)

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
