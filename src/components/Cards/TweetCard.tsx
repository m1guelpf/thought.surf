import { Camera } from '@/types/canvas'
import TweetLoader from '../TweetLoader'
import { useRoom } from '@/lib/liveblocks'
import useMeasure from '@/hooks/useMeasure'
import { screenToCanvas } from '@/lib/canvas'
import { LiveObject } from '@liveblocks/client'
import { FC, memo, useEffect, useState } from 'react'
import { CardOptions, CardType, URLCard } from '@/types/cards'
import useRegisterAction from '@/hooks/useRegisterAction'
import TwitterIcon from '../Icons/TwitterIcon'
import { Sections } from '@/types/command-bar'
import useSWR from 'swr'
import { TweetDetails } from '@/types/twitter'
import Tweet from '../Tweet'

export const tweetCardOptions: CardOptions = {
	resizeAxis: { x: true, y: false },
}

const TweetCard: FC<{ item: LiveObject<URLCard>; id: string; navigateTo: () => void }> = ({ id, item, navigateTo }) => {
	const room = useRoom()
	const [measureRef, { height }] = useMeasure<HTMLDivElement>()
	const [
		{
			attributes: { url },
		},
		setItem,
	] = useState(item.toObject())

	useEffect(() => {
		function onChange() {
			setItem(item.toObject())
		}

		return room.subscribe(item, onChange)
	}, [room, item])

	useEffect(() => {
		const { width } = item.get('size')

		item.set('size', { width, height: height + 20 })
	}, [item, height])

	const { data, isLoading } = useSWR<TweetDetails>(`https://miguelpiedrafita.com/api/tweet-details?tweet_url=${url}`)
	useRegisterAction(
		{
			id: `canvas-item-${id}`,
			name: data?.user?.name
				? `${data?.user?.name} (@${data?.user?.screen_name}): ${data?.full_text.substring(0, 100)}`
				: 'Loading...',
			icon: <TwitterIcon />,
			parent: 'canvas',
			section: Sections.Canvas,
			perform: navigateTo,
		},
		[item, data?.user?.name, data?.user?.screen_name, data?.full_text]
	)

	if (isLoading) return null

	return (
		<div className="select-none" ref={measureRef}>
			<Tweet tweet={data} />
		</div>
	)
}

export const createTweetCard = (camera: Camera, url: string): URLCard => ({
	attributes: { url },
	type: CardType.TWEET,
	size: { width: 500, height: 500 },
	point: screenToCanvas({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, camera),
})

export default memo(TweetCard)
