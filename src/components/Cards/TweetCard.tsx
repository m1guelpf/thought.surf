import useSWR from 'swr'
import Tweet from '../Tweet'
import toast from 'react-hot-toast'
import { REGEX } from '@/lib/consts'
import useItem from '@/hooks/useItem'
import { Camera } from '@/types/canvas'
import useMeasure from '@/hooks/useMeasure'
import { screenToCanvas } from '@/lib/canvas'
import { TweetDetails } from '@/types/twitter'
import { Sections } from '@/types/command-bar'
import TwitterIcon from '../Icons/TwitterIcon'
import { LiveObject } from '@liveblocks/client'
import useDirtyState from '@/hooks/useDirtyState'
import { FC, memo, useEffect, useState } from 'react'
import useRegisterAction from '@/hooks/useRegisterAction'
import { ArrowUpIcon, XIcon } from '@heroicons/react/solid'
import { CardOptions, CardType, URLCard } from '@/types/cards'

export const tweetCardOptions: CardOptions = {
	resizeAxis: { x: true, y: false },
}

const TweetCard: FC<{ item: LiveObject<URLCard>; id: string; navigateTo: () => void; onDelete: () => void }> = ({
	id,
	item,
	navigateTo,
	onDelete,
}) => {
	const [isFocused, setFocused] = useState(false)
	const [measureRef, { height }] = useMeasure<HTMLDivElement>()
	const {
		attributes: { url },
	} = useItem(item)

	useEffect(() => {
		const { width } = item.get('size')

		item.set('size', { width, height: height + 20 })
	}, [item, height])

	const [_url, setUrl, urlDirty] = useDirtyState(url)

	useEffect(() => {
		if (!urlDirty) setUrl(url, { isClean: true })
	}, [setUrl, url, urlDirty])

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

	const handleUrlBlur = () => {
		setFocused(false)
		if (!urlDirty) return

		if (!REGEX.URL.test(_url)) {
			setUrl(url, { isClean: true })
			return toast.error('Invalid URL')
		}

		if (!REGEX.TWEET_URL.test(_url)) {
			setUrl(url, { isClean: true })
			return toast.error('URL is not a tweet')
		}

		setUrl(_url, { isClean: true })
		item.update({ attributes: { url: _url } })
	}

	if (isLoading) return null

	return (
		<>
			<div className="absolute bottom-4 inset-x-4 bg-white dark:bg-gray-800 shadow py-2 px-2 rounded-lg opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-between overflow-hidden space-x-6 z-20">
				<div className="flex items-center space-x-2 flex-1 ml-2 relative">
					<TwitterIcon className="w-4 h-4 absolute left-0 inset-y-1/4 text-gray-400 z-[1]" />
					<input
						className="bg-transparent rounded-lg flex-1 p-1 px-2 pl-7 !-ml-2 text-gray-600 dark:text-gray-400 z-[2]"
						type="url"
						value={
							isFocused
								? _url
								: `${data?.user?.name} (@${data?.user?.screen_name}): ${data?.full_text.substring(
										0,
										100
								  )}`
						}
						onFocus={() => setFocused(true)}
						onBlur={handleUrlBlur}
						onKeyDown={e => {
							if (e.key !== 'Enter') return
							;(e.target as HTMLInputElement).blur()
						}}
						onChange={event => setUrl(event.target.value.trim())}
					/>
				</div>
				<div className="flex items-center space-x-1">
					<a
						href={url}
						target="_blank"
						className="bg-gray-200/60 dark:bg-gray-700/60 rounded p-1 opacity-80 hover:opacity-100 transition-opacity"
						rel="noreferrer"
					>
						<ArrowUpIcon className="w-4 h-4 transform rotate-45" />
					</a>
					<button
						onClick={onDelete}
						className="bg-gray-200/60 dark:bg-gray-700/60 rounded p-1 opacity-80 hover:opacity-100 transition-opacity"
					>
						<XIcon className="w-4 h-4" />
					</button>
				</div>
			</div>
			<div className="select-none" ref={measureRef}>
				<Tweet tweet={data} />
			</div>
		</>
	)
}

export const createTweetCard = (camera: Camera, url: string): URLCard => ({
	attributes: { url },
	type: CardType.TWEET,
	size: { width: 500, height: 500 },
	point: screenToCanvas({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, camera),
})

export default memo(TweetCard)
