import IconBox from '../IconBox'
import { REGEX } from '@/lib/consts'
import { getDomain } from '@/lib/utils'
import { Camera } from '@/types/canvas'
import { useRoom } from '@/lib/liveblocks'
import useSWRImmutable from 'swr/immutable'
import { createTweetCard } from './TweetCard'
import { screenToCanvas } from '@/lib/canvas'
import Skeleton from 'react-loading-skeleton'
import { Sections } from '@/types/command-bar'
import { LiveObject } from '@liveblocks/client'
import { MqlResponseData } from '@microlink/mql'
import { LinkIcon } from '@heroicons/react/outline'
import { FC, memo, useEffect, useState } from 'react'
import useRegisterAction from '@/hooks/useRegisterAction'
import { CardOptions, CardType, URLCard } from '@/types/cards'

export const urlCardOptions: CardOptions = {
	resizeAxis: { x: true, y: true },
}

const URLCard: FC<{ item: LiveObject<URLCard>; id: string; navigateTo: () => void }> = ({ id, item, navigateTo }) => {
	const room = useRoom()
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

	const { data, isLoading } = useSWRImmutable<MqlResponseData>(
		() => url && `/api/link-preview?url=${url}&screenshot=true`
	)

	useRegisterAction(
		{
			id: `canvas-item-${id}`,
			name: data?.title ?? getDomain(url),
			icon: data?.logo ? <img className="rounded w-full h-full" src={data.logo.url} alt="" /> : <LinkIcon />,
			parent: 'canvas',
			section: Sections.Canvas,
			perform: navigateTo,
		},
		[item, data?.title, data?.logo]
	)

	return (
		<div className="w-full h-full space-y-3 flex flex-col">
			<div className="flex items-center space-x-3">
				{(isLoading || data?.logo) && <IconBox src={data?.logo?.url} alt={data?.title} />}
				<div className="overflow-hidden">
					<p className="select-none">{data?.title ?? <Skeleton />}</p>
					<p className="text-black/60 dark:text-white/40 text-sm select-none whitespace-nowrap truncate min-w-0">
						{data?.description ?? <Skeleton width={250} />}
					</p>
				</div>
			</div>
			<div className="min-h-0 flex-1">
				{data?.screenshot ? (
					<img
						className="h-full rounded-lg block object-cover select-none pointer-events-none"
						src={data?.screenshot?.url}
						alt={data?.screenshot?.url}
					/>
				) : (
					<Skeleton className="rounded-lg" width="100%" height="100%" />
				)}
			</div>
		</div>
	)
}

export const createURLCard = (camera: Camera, url: string): URLCard => {
	url = url.startsWith('http') ? url : `https://${url}`

	if (REGEX.TWEET_URL.test(url)) return createTweetCard(camera, url)

	return {
		point: screenToCanvas({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, camera),
		size: { width: 500, height: 500 },
		type: CardType.URL,
		attributes: { url },
	}
}

export default memo(URLCard)
