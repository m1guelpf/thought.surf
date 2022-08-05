import Card from '../Card'
import toast from 'react-hot-toast'
import { REGEX } from '@/lib/consts'
import PinButton from '../PinButton'
import useCard from '@/hooks/useCard'
import { motion } from 'framer-motion'
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
import AutosizeInput from 'react-18-input-autosize'
import useRegisterAction from '@/hooks/useRegisterAction'
import { classNames, getDomain, randomId } from '@/lib/utils'
import { ArrowUpIcon, XIcon, LinkIcon } from '@heroicons/react/solid'
import { FC, memo, MutableRefObject, useCallback, useEffect, useMemo, useState } from 'react'

type Props = {
	id: string
	onReorder: () => void
	navigateTo: () => void
	onDelete: () => unknown
	card: LiveObject<URLCard>
	containerRef: MutableRefObject<HTMLDivElement>
}

const URLCard: FC<Props> = ({ id, card, onDelete, navigateTo, onReorder, containerRef }) => {
	const controls = useAnimation()

	const [iframeRef, { width: iframeWidth }] = useMeasure<HTMLIFrameElement>()
	const {
		size: { width, height },
		attributes: { url, isLive },
	} = useCard(card)

	const { data, isLoading } = useSWRImmutable<MqlResponseData>(
		() => url && `/api/link-preview?url=${url}&screenshot=true&video=true&embed=true`
	)

	const hasValidEmbed = useMemo<boolean>(
		() => !data?.video && data?.iframe && data?.iframe?.scripts?.length == 0,
		[data?.video, data?.iframe]
	)

	useRegisterAction(
		{
			parent: 'canvas',
			perform: navigateTo,
			id: `canvas-item-${id}`,
			section: Sections.Canvas,
			name: data?.title ?? getDomain(url),
			icon: data?.logo ? <img className="rounded w-full h-full" src={data.logo.url} alt="" /> : <LinkIcon />,
		},
		[card, data?.title, data?.logo]
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

	const cardOptions = useMemo(
		() => ({ resizeAxis: { x: isLive && !data?.video ? width >= iframeWidth : true, y: true } }),
		[isLive, data?.video, width, iframeWidth]
	)
	const Header = useMemo(
		() => <CardHeader card={card} hasValidEmbed={hasValidEmbed} onDelete={onDelete} />,
		[card, hasValidEmbed, onDelete]
	)

	return (
		<Card
			id={id}
			unboxed
			card={card}
			header={Header}
			onDelete={onDelete}
			onReorder={onReorder}
			options={cardOptions}
			containerRef={containerRef}
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

type CardHeaderProps = {
	card: LiveObject<URLCard>
	hasValidEmbed: boolean
	onDelete: () => void
}

const CardHeader: FC<CardHeaderProps> = memo(({ card, hasValidEmbed, onDelete }) => {
	const {
		headerPinned,
		attributes: { url, isLive },
	} = useCard(card)

	const { data, isLoading } = useSWRImmutable<MqlResponseData>(
		() => url && `/api/link-preview?url=${url}&screenshot=true&video=true&embed=true`
	)

	const [isFocused, setFocused] = useState(false)
	const [_url, setUrl, urlDirty] = useDirtyState(url)

	useEffect(() => {
		if (!urlDirty) setUrl(url, { isClean: true })
	}, [setUrl, url, urlDirty])

	const handleUrlBlur = () => {
		setFocused(false)
		if (!urlDirty) return

		if (!REGEX.URL.test(_url)) {
			setUrl(url, { isClean: true })
			return toast.error('Invalid URL')
		}

		setUrl(_url, { isClean: true })
		card.update({ attributes: { url: _url, isLive } })
	}

	const updatePinned = useCallback(pinned => card.set('headerPinned', pinned), [card])

	return (
		<div
			className={classNames(
				!headerPinned &&
					'opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300',
				'flex items-center justify-between bg-gray-100/80 dark:bg-black/80 p-2 rounded-lg w-full space-x-2'
			)}
		>
			<motion.div
				className="flex items-center space-x-3 flex-shrink min-w-0 px-6 -mx-6"
				animate="pinHidden"
				whileHover="pinVisible"
			>
				<PinButton
					baseVariant="pinHidden"
					isPinned={headerPinned}
					onChange={updatePinned}
					hoverVariant="pinVisible"
				/>
				{isLoading && <Skeleton className="z-[2]" width={32} height={32} circle />}
				{data?.logo && (
					<img
						alt={data?.title}
						draggable={false}
						src={data?.logo?.url}
						className="w-8 h-8 rounded-lg z-[2]"
					/>
				)}
				<div className="overflow-hidden z-[2]">
					<p className="select-none whitespace-nowrap">{data?.title ?? <Skeleton />}</p>
					<p className="text-black/40 dark:text-white/40 text-xs select-none whitespace-nowrap truncate min-w-0">
						<AutosizeInput
							value={isFocused ? _url : data?.author ?? data?.description ?? _url}
							onBlur={handleUrlBlur}
							onFocus={() => setFocused(true)}
							onChange={e => setUrl(e.target.value.trim())}
							inputClassName="py-0.5 px-1 rounded-lg bg-transparent focus:bg-gray-200/50 focus:dark:bg-gray-800 focus:outline-none transition "
							onKeyDown={e => {
								if (e.key !== 'Enter') return
								;(e.target as HTMLInputElement).blur()
							}}
						/>
					</p>
				</div>
			</motion.div>
			<div
				className={classNames(
					headerPinned &&
						'opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300',
					'flex items-center space-x-1 flex-shrink-0'
				)}
			>
				{!hasValidEmbed && (
					<button
						onClick={() => card.update({ attributes: { url, isLive: !isLive } })}
						className={classNames(
							isLive
								? 'opacity-100 bg-gray-300/60 dark:bg-gray-500/60'
								: 'opacity-60 hover:opacity-80 bg-gray-200/60 dark:bg-gray-700/60',
							'rounded p-1 opacity-60 transition'
						)}
					>
						{isLive ? <PauseIcon className="w-4 h-4 p-0.5" /> : <PlayIcon className="w-4 h-4 p-0.5" />}
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
	)
})
CardHeader.displayName = 'CardHeader'

export const createURLCard = (camera: Camera, { url, point }: { url: string; point?: Point }): URLCard => {
	url = url.startsWith('http') ? url : `https://${url}`

	if (REGEX.TWEET_URL.test(url)) return createTweetCard(camera, url)

	return {
		id: randomId(),
		type: CardType.URL,
		size: { width: 500, height: 500 },
		attributes: { url, isLive: false },
		point: screenToCanvas(point ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 }, camera),
	}
}

export default memo(URLCard)
