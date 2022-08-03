import useSWR from 'swr'
import Card from '../Card'
import Tweet from '../Tweet'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { REGEX } from '@/lib/consts'
import PinButton from '../PinButton'
import useItem from '@/hooks/useItem'
import { motion } from 'framer-motion'
import { Camera } from '@/types/canvas'
import { classNames } from '@/lib/utils'
import { clearURL } from '@/lib/twitter'
import useMeasure from '@/hooks/useMeasure'
import { screenToCanvas } from '@/lib/canvas'
import Skeleton from 'react-loading-skeleton'
import { TweetDetails } from '@/types/twitter'
import { Sections } from '@/types/command-bar'
import TwitterIcon from '../Icons/TwitterIcon'
import { LiveObject } from '@liveblocks/client'
import AutosizeInput from 'react-input-autosize'
import { CardType, URLCard } from '@/types/cards'
import useDirtyState from '@/hooks/useDirtyState'
import useRegisterAction from '@/hooks/useRegisterAction'
import { ArrowUpIcon, XIcon } from '@heroicons/react/solid'
import { FC, memo, useCallback, useEffect, useState } from 'react'

type Props = { item: LiveObject<URLCard>; id: string; navigateTo: () => void; onDelete: () => void }

const TweetCard: FC<Props> = ({ id, item, navigateTo, onDelete }) => {
	const [isFocused, setFocused] = useState(false)
	const [measureRef, { height }] = useMeasure<HTMLDivElement>()
	const {
		headerPinned,
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
		item.update({ attributes: { url: _url, isLive: false } })
	}

	const updatePinned = useCallback(pinned => item.set('headerPinned', pinned), [item])

	return (
		<Card
			id={id}
			item={item}
			onDelete={onDelete}
			options={{ resizeAxis: { x: true, y: false } }}
			header={
				<div
					className={classNames(
						!headerPinned &&
							'opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300',
						'flex items-center justify-between bg-gray-100/80 dark:bg-black/80 p-2 rounded-lg w-full space-x-2'
					)}
				>
					<motion.div
						animate="pinHidden"
						whileHover="pinVisible"
						className="flex items-center space-x-3 flex-shrink min-w-0 px-6 -mx-6"
					>
						<PinButton
							isPinned={headerPinned}
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
								{data?.user?.name ?? (data?.user?.screen_name && `@${data?.user?.screen_name}`) ?? (
									<Skeleton />
								)}
							</p>
							<p className="text-black/40 dark:text-white/40 text-xs select-none whitespace-nowrap min-w-0">
								<AutosizeInput
									value={
										isFocused
											? _url
											: isLoading
											? _url
											: `@${data?.user?.screen_name} • ${format(
													new Date(data?.created_at),
													'hh:mm a'
											  )}`
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
							headerPinned &&
								'opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300',
							'flex items-center space-x-1 flex-shrink-0'
						)}
					>
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
			<div className="select-none" ref={measureRef}>
				<Tweet tweet={data} isCard />
			</div>
		</Card>
	)
}

export const createTweetCard = (camera: Camera, url: string): URLCard => ({
	attributes: { url: clearURL(url), isLive: false },
	type: CardType.TWEET,
	size: { width: 500, height: 500 },
	point: screenToCanvas({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, camera),
})

export default memo(TweetCard)
