import Card from '../Card'
import Tweet from '../Tweet'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { REGEX } from '@/lib/consts'
import PinButton from '../PinButton'
import { motion } from 'framer-motion'
import { Camera } from '@/types/canvas'
import { clearURL } from '@/lib/twitter'
import useSWRImmutable from 'swr/immutable'
import useMeasure from '@/hooks/useMeasure'
import { screenToCanvas } from '@/lib/canvas'
import Skeleton from 'react-loading-skeleton'
import { TweetDetails } from '@/types/twitter'
import { Sections } from '@/types/command-bar'
import TwitterIcon from '../Icons/TwitterIcon'
import { CardType, URLCard } from '@/types/cards'
import useDirtyState from '@/hooks/useDirtyState'
import { classNames, randomId } from '@/lib/utils'
import AutosizeInput from 'react-18-input-autosize'
import useRegisterAction from '@/hooks/useRegisterAction'
import { useDeleteCard, useUpdateCard } from '@/hooks/useCard'
import { ArrowUpIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { FC, memo, MutableRefObject, useCallback, useEffect, useMemo, useState } from 'react'

type Props = {
	id: string
	card: URLCard
	navigateTo: () => void
	containerRef: MutableRefObject<HTMLDivElement>
}

const cardOptions = { resizeAxis: { x: true, y: false } }

const TweetCard: FC<Props> = ({ id, card, navigateTo, containerRef }) => {
	const updateCard = useUpdateCard(card.id)
	const [measureRef, { height }] = useMeasure<HTMLDivElement>()

	useEffect(() => {
		if (card.size.height == height + 20) return

		const { width } = card.size
		updateCard({ size: { width, height: height + 20 } })
	}, [card, height])

	const [_url, setUrl, urlDirty] = useDirtyState(card.attributes.url)

	useEffect(() => {
		if (!urlDirty) setUrl(card.attributes.url, { isClean: true })
	}, [setUrl, card.attributes.url, urlDirty])

	const { data } = useSWRImmutable<TweetDetails>(`/api/tweet-details?url=${card.attributes.url}`)

	useRegisterAction(
		{
			id: `canvas-item-${id}`,
			name: data?.user?.name
				? `${data?.user?.name} (@${data?.user?.screen_name}): ${data?.text.substring(0, 100)}`
				: 'Loading...',
			icon: <TwitterIcon />,
			parent: 'canvas',
			section: Sections.Canvas,
			perform: navigateTo,
		},
		[id, data?.user?.name, data?.user?.screen_name, data?.text]
	)

	const Header = useMemo(() => <CardHeader card={card} />, [card])

	return (
		<Card id={id} card={card} options={cardOptions} header={Header} containerRef={containerRef}>
			<div className="select-none" ref={measureRef}>
				<Tweet tweet={data} isCard />
			</div>
		</Card>
	)
}

type CardHeaderProps = {
	card: URLCard
}

const CardHeader: FC<CardHeaderProps> = memo(({ card }) => {
	const updateCard = useUpdateCard(card.id)
	const deleteCard = useDeleteCard(card.id)

	const { data, isLoading } = useSWRImmutable<TweetDetails>(`/api/tweet-details?url=${card.attributes.url}`)

	const [isFocused, setFocused] = useState(false)
	const [_url, setUrl, urlDirty] = useDirtyState(card.attributes.url)

	useEffect(() => {
		if (!urlDirty) setUrl(card.attributes.url, { isClean: true })
	}, [setUrl, card.attributes.url, urlDirty])

	const handleUrlBlur = () => {
		setFocused(false)
		if (!urlDirty) return

		if (!REGEX.URL.test(_url)) {
			setUrl(card.attributes.url, { isClean: true })
			return toast.error('Invalid URL')
		}

		if (!REGEX.TWEET_URL.test(_url)) {
			setUrl(card.attributes.url, { isClean: true })
			return toast.error('URL is not a tweet')
		}

		setUrl(_url, { isClean: true })
		updateCard({ attributes: { url: _url, isLive: false } })
	}

	const updatePinned = useCallback(headerPinned => updateCard({ headerPinned }), [card])

	return (
		<div
			className={classNames(
				!card.headerPinned &&
					'opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300',
				'flex items-center justify-between bg-gray-100/40 dark:bg-black/40 backdrop-blur backdrop-filter p-2 rounded-lg w-full space-x-2'
			)}
		>
			<motion.div
				animate="pinHidden"
				whileHover="pinVisible"
				className="flex items-center space-x-3 flex-shrink min-w-0 px-6 -mx-6"
			>
				<PinButton
					isPinned={card.headerPinned}
					onChange={updatePinned}
					baseVariant="pinHidden"
					hoverVariant="pinVisible"
				/>
				{isLoading && <Skeleton className="z-[2]" width={32} height={32} circle />}
				{data?.user?.profile_image_url_https && (
					<img
						draggable={false}
						className="w-8 h-8 rounded-full z-[2]"
						src={data?.user?.profile_image_url_https}
						alt={data?.user?.name}
					/>
				)}
				<div className="overflow-hidden z-[2]">
					<p className="select-none whitespace-nowrap">
						{data?.user?.name ?? (data?.user?.screen_name && `@${data?.user?.screen_name}`) ?? <Skeleton />}
					</p>
					<p className="text-black/40 dark:text-white/40 text-xs select-none whitespace-nowrap min-w-0">
						<AutosizeInput
							value={
								isFocused
									? _url
									: isLoading
										? _url
										: `@${data?.user?.screen_name} • ${
												data?.created_at ? format(new Date(data?.created_at), 'hh:mm a') : ''
											}`
							}
							onBlur={handleUrlBlur}
							onFocus={() => setFocused(true)}
							onChange={e => setUrl(clearURL(e.target.value.trim()))}
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
					card.headerPinned &&
						'opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300',
					'flex items-center space-x-1 flex-shrink-0'
				)}
			>
				<a
					href={card.attributes.url}
					target="_blank"
					className="bg-gray-200/60 dark:bg-gray-700/60 rounded p-1 opacity-80 hover:opacity-100 transition-opacity"
					rel="noreferrer"
				>
					<ArrowUpIcon className="w-4 h-4 transform rotate-45" />
				</a>
				<button
					onClick={deleteCard}
					className="bg-gray-200/60 dark:bg-gray-700/60 rounded p-1 opacity-80 hover:opacity-100 transition-opacity"
				>
					<XMarkIcon className="w-4 h-4" />
				</button>
			</div>
		</div>
	)
})
CardHeader.displayName = 'CardHeader'

export const createTweetCard = (camera: Camera, url: string): URLCard => ({
	id: randomId(),
	type: CardType.TWEET,
	size: { width: 500, height: 500 },
	attributes: { url: clearURL(url), isLive: false },
	point: screenToCanvas({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, camera),
})

export default memo(TweetCard)
