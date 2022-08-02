import Card from '../Card'
import toast from 'react-hot-toast'
import { REGEX } from '@/lib/consts'
import useItem from '@/hooks/useItem'
import Video from '@/components/Video'
import PlayIcon from '../Icons/PlayIcon'
import PauseIcon from '../Icons/PauseIcon'
import useSWRImmutable from 'swr/immutable'
import useMeasure from '@/hooks/useMeasure'
import { useAnimation } from 'framer-motion'
import { createTweetCard } from './TweetCard'
import { screenToCanvas } from '@/lib/canvas'
import Skeleton from 'react-loading-skeleton'
import { Camera, Point } from '@/types/canvas'
import { Sections } from '@/types/command-bar'
import { LiveObject } from '@liveblocks/client'
import { MqlResponseData } from '@microlink/mql'
import { CardType, URLCard } from '@/types/cards'
import useDirtyState from '@/hooks/useDirtyState'
import { classNames, getDomain } from '@/lib/utils'
import { FC, memo, useEffect, useMemo } from 'react'
import useRegisterAction from '@/hooks/useRegisterAction'
import { ArrowUpIcon, XIcon, LinkIcon } from '@heroicons/react/solid'

const URLCard: FC<{ item: LiveObject<URLCard>; id: string; navigateTo: () => void; onDelete: () => unknown }> = ({
	id,
	item,
	onDelete,
	navigateTo,
}) => {
	const controls = useAnimation()
	const [iframeRef, { width: iframeWidth }] = useMeasure<HTMLIFrameElement>()
	const {
		size: { width, height },
		attributes: { url, isLive },
	} = useItem(item)

	const [_url, setUrl, urlDirty] = useDirtyState(url)

	useEffect(() => {
		if (!urlDirty) setUrl(url, { isClean: true })
	}, [setUrl, url, urlDirty])

	const { data, isLoading } = useSWRImmutable<MqlResponseData>(
		() => url && `/api/link-preview?url=${url}&screenshot=true&video=true&embed=true`
	)

	const hasValidEmbed = useMemo<boolean>(
		() => !data?.video && data?.iframe && data?.iframe?.scripts?.length == 0,
		[data?.video, data?.iframe]
	)

	const handleUrlBlur = () => {
		if (!urlDirty) return

		if (!REGEX.URL.test(_url)) {
			setUrl(url, { isClean: true })
			return toast.error('Invalid URL')
		}

		setUrl(_url, { isClean: true })
		item.update({ attributes: { url: _url, isLive } })
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

	useEffect(() => {
		if (!data?.video) return

		controls.set({ y: isLive ? -height + 75 : 0 })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [height])

	useEffect(() => {
		if (!data?.video) return

		controls.start({ y: isLive ? -height + 75 : 0 })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLive])

	return (
		<Card
			id={id}
			unboxed
			item={item}
			onDelete={onDelete}
			options={{ resizeAxis: { x: width >= iframeWidth, y: true } }}
			header={
				<div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-100/80 dark:bg-black/80 p-2 rounded-lg w-full space-x-2">
					<div className="flex items-center space-x-3 flex-shrink min-w-0">
						{data?.logo ? (
							<img className="w-8 h-8 rounded-lg" src={data?.logo?.url} alt={data?.title} />
						) : (
							<Skeleton width={32} height={32} circle />
						)}
						<div className="overflow-hidden">
							<p className="select-none whitespace-nowrap">{data?.title ?? <Skeleton />}</p>
							<p className="text-black/40 dark:text-white/40 text-xs select-none whitespace-nowrap truncate min-w-0">
								{data?.author && <>{data?.author} &bull;</>} {data?.url}
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-1 flex-shrink-0">
						{!hasValidEmbed && (
							<button
								onClick={() => item.update({ attributes: { url, isLive: !isLive } })}
								className={classNames(
									isLive
										? 'opacity-100 bg-gray-300/60 dark:bg-gray-500/60'
										: 'opacity-60 hover:opacity-80 bg-gray-200/60 dark:bg-gray-700/60',
									'rounded p-1 opacity-60 transition'
								)}
							>
								{isLive ? (
									<PauseIcon className="w-4 h-4 p-0.5" />
								) : (
									<PlayIcon className="w-4 h-4 p-0.5" />
								)}
							</button>
						)}
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
			}
		>
			{(() => {
				// if response hasn't loaded yet, show placeholder
				if (isLoading) {
					return <Skeleton className="rounded-lg" width="100%" height="100%" />
				}

				// if we're in live mode with a video, show the video
				if (isLive && data.video) {
					return <Video src={data.video.url} poster={data?.image?.url} />
				}

				// if we're in live mode with no video, embed the page
				if (isLive) {
					return (
						<iframe
							src={url}
							loading="lazy"
							title={data?.title}
							className="h-full w-full rounded-lg block object-cover"
						/>
					)
				}

				// if we're not in live mode with a video, show the poster
				if (data?.video) {
					return (
						<img
							alt={data?.title}
							draggable="false"
							src={data?.image?.url ?? data?.screenshot?.url}
							className="h-full w-full rounded-lg block object-cover select-none pointer-events-none"
						/>
					)
				}

				// if we're not in a video and have an embed, show the embed
				if (hasValidEmbed) {
					return (
						<span
							ref={iframeRef}
							data-iframe-container
							className="h-full w-full rounded-lg overflow-hidden block object-cover"
							dangerouslySetInnerHTML={{ __html: data?.iframe?.html }}
						/>
					)
				}

				// else, show the screenshot (fallback to the image)
				return (
					<img
						alt={data?.title}
						draggable="false"
						src={data?.screenshot?.url ?? data?.image?.url}
						className="h-full w-full rounded-lg block object-cover select-none pointer-events-none"
					/>
				)
			})()}
		</Card>
	)
}

export const createURLCard = (camera: Camera, { url, point }: { url: string; point?: Point }): URLCard => {
	url = url.startsWith('http') ? url : `https://${url}`

	if (REGEX.TWEET_URL.test(url)) return createTweetCard(camera, url)

	return {
		type: CardType.URL,
		size: { width: 500, height: 500 },
		attributes: { url, isLive: false },
		point: screenToCanvas(point ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 }, camera),
	}
}

export default memo(URLCard)
