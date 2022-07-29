import IconBox from '../IconBox'
import toast from 'react-hot-toast'
import { REGEX } from '@/lib/consts'
import useItem from '@/hooks/useItem'
import { getDomain } from '@/lib/utils'
import { Camera } from '@/types/canvas'
import { FC, memo, useEffect } from 'react'
import useSWRImmutable from 'swr/immutable'
import { createTweetCard } from './TweetCard'
import { screenToCanvas } from '@/lib/canvas'
import Skeleton from 'react-loading-skeleton'
import { Sections } from '@/types/command-bar'
import { LiveObject } from '@liveblocks/client'
import { MqlResponseData } from '@microlink/mql'
import useDirtyState from '@/hooks/useDirtyState'
import useRegisterAction from '@/hooks/useRegisterAction'
import { CardOptions, CardType, URLCard } from '@/types/cards'
import { ArrowUpIcon, XIcon, LinkIcon } from '@heroicons/react/solid'

export const urlCardOptions: CardOptions = {
	hasDeleteButton: true,
	resizeAxis: { x: true, y: true },
}

const URLCard: FC<{ item: LiveObject<URLCard>; id: string; navigateTo: () => void; onDelete: () => unknown }> = ({
	id,
	item,
	onDelete,
	navigateTo,
}) => {
	const {
		attributes: { url },
	} = useItem(item)

	const [_url, setUrl, urlDirty] = useDirtyState(url)

	useEffect(() => {
		if (!urlDirty) setUrl(url, { isClean: true })
	}, [setUrl, url, urlDirty])

	const { data, isLoading } = useSWRImmutable<MqlResponseData>(
		() => url && `/api/link-preview?url=${url}&screenshot=true`
	)

	const handleUrlBlur = () => {
		if (!urlDirty) return

		if (!REGEX.URL.test(_url)) {
			setUrl(url, { isClean: true })
			return toast.error('Invalid URL')
		}

		setUrl(_url, { isClean: true })
		item.update({ attributes: { url: _url } })
	}

	useRegisterAction(
		{
			parent: 'canvas',
			perform: navigateTo,
			id: `canvas-item-${id}`,
			section: Sections.Canvas,
			name: data?.title ?? getDomain(url),
			icon: data?.logo ? <img className="rounded w-full h-full" src={data.logo.url} alt="" /> : <LinkIcon />,
		},
		[item, data?.title, data?.logo]
	)

	return (
		<>
			<div className="absolute bottom-4 inset-x-4 bg-white dark:bg-gray-800 shadow py-2 px-2 rounded-lg opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-between overflow-hidden space-x-6">
				<div className="flex items-center space-x-2 flex-1 ml-2 relative">
					<LinkIcon className="w-4 h-4 absolute left-0 inset-y-1/4 text-gray-400 z-[1]" />
					<input
						className="bg-transparent rounded-lg flex-1 p-1 px-2 pl-7 !-ml-2 text-gray-600 dark:text-gray-400 z-[2]"
						type="url"
						value={_url}
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
						className="bg-gray-300/60 dark:bg-gray-700/60 rounded p-1 opacity-80 hover:opacity-100 transition-opacity"
						rel="noreferrer"
					>
						<ArrowUpIcon className="w-4 h-4 transform rotate-45" />
					</a>
					<button
						onClick={onDelete}
						className="bg-gray-300/60 dark:bg-gray-700/60 rounded p-1 opacity-80 hover:opacity-100 transition-opacity"
					>
						<XIcon className="w-4 h-4" />
					</button>
				</div>
			</div>
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
							className="h-full w-full rounded-lg block object-cover select-none pointer-events-none"
							src={data?.screenshot?.url}
							alt={data?.screenshot?.url}
						/>
					) : (
						<Skeleton className="rounded-lg" width="100%" height="100%" />
					)}
				</div>
			</div>
		</>
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
