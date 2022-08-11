import Card from '../Card'
import PinButton from '../PinButton'
import { getName } from '@/lib/names'
import useCard from '@/hooks/useCard'
import { motion } from 'framer-motion'
import { screenToCanvas } from '@/lib/canvas'
import Skeleton from 'react-loading-skeleton'
import { Camera, Point } from '@/types/canvas'
import { uploadFile } from '@/lib/file-upload'
import { Sections } from '@/types/command-bar'
import { LiveObject } from '@liveblocks/client'
import HeaderTopIcon from '../Icons/HeaderTopIcon'
import InputFieldIcon from '../Icons/InputFieldIcon'
import useRegisterAction from '@/hooks/useRegisterAction'
import { classNames, randomId, requestFile } from '@/lib/utils'
import { CardOptions, CardType, ImageCard } from '@/types/cards'
import { XIcon, PhotographIcon, UploadIcon } from '@heroicons/react/solid'
import { PhotographIcon as PhotographMenuIcon } from '@heroicons/react/outline'
import { FC, memo, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Props = {
	id: string
	onReorder: () => void
	navigateTo: () => void
	onDelete: () => unknown
	card: LiveObject<ImageCard>
	containerRef: MutableRefObject<HTMLDivElement>
}

const ImageCard: FC<Props> = ({ id, card, onDelete, navigateTo, onReorder, containerRef }) => {
	const titleInputRef = useRef<HTMLInputElement>(null)
	const [isLoaded, setLoaded] = useState<boolean>(false)
	const {
		headerPinned,
		attributes: { url, title },
	} = useCard(card)

	const replaceImage = useCallback(async () => {
		const file = await requestFile(['image/gif', 'image/jpg', 'image/jpeg', 'image/png'])

		card.update({
			attributes: {
				mimeType: file.type,
				url: await uploadFile(file),
				title: card.get('attributes').title,
			},
		})
	}, [card])

	useEffect(() => {
		setLoaded(false)
	}, [url])

	useRegisterAction(
		{
			parent: 'canvas',
			perform: navigateTo,
			id: `canvas-item-${id}`,
			section: Sections.Canvas,
			name: title,
			icon: <PhotographIcon />,
		},
		[card, title]
	)

	const cardOptions = useMemo<CardOptions>(
		() => ({
			resizeAxis: { x: true, y: true },
			menuItems: [
				{
					label: 'Change Title',
					icon: <InputFieldIcon className="h-3.5 w-3.5" />,
					action: () => requestAnimationFrame(() => titleInputRef.current?.focus()),
				},
				{
					label: 'Replace Image',
					action: replaceImage,
					icon: <PhotographMenuIcon className="h-3.5 w-3.5" />,
				},
				{
					label: 'Pin Header',
					checked: headerPinned,
					icon: <HeaderTopIcon className="h-3.5 w-3.5" />,
					onChange: headerPinned => card.update({ headerPinned }),
				},
			],
		}),
		[card, headerPinned, replaceImage]
	)

	const Header = useMemo(
		() => <CardHeader card={card} onDelete={onDelete} replaceImage={replaceImage} inputRef={titleInputRef} />,
		[card, replaceImage, onDelete, titleInputRef]
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
			<img
				onLoad={() => setLoaded(true)}
				alt={title}
				draggable="false"
				src={url}
				className="h-full w-full rounded-lg block object-cover select-none pointer-events-none"
			/>
			{!isLoaded && <Skeleton width="100%" height="100%" className="absolute inset-0 rounded-lg block" />}
		</Card>
	)
}

type CardHeaderProps = {
	onDelete: () => void
	replaceImage: () => void
	card: LiveObject<ImageCard>
	inputRef: MutableRefObject<HTMLInputElement>
}

const CardHeader: FC<CardHeaderProps> = memo(({ card, replaceImage, onDelete, inputRef }) => {
	const {
		headerPinned,
		attributes: { title },
	} = useCard(card)

	const updatePinned = useCallback(pinned => card.set('headerPinned', pinned), [card])
	const updateTitle = useCallback(
		event =>
			card.update({
				attributes: {
					title: event.target.value,
					url: card.get('attributes').url,
					mimeType: card.get('attributes').mimeType,
				},
			}),
		[card]
	)

	return (
		<div
			className={classNames(
				!headerPinned && 'opacity-0 group-hover:opacity-100 focus-within:opacity-100',
				'flex items-center justify-between bg-gray-100/80 dark:bg-black/80 p-2 rounded-lg w-full space-x-2 transition-opacity duration-300'
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
				<div className="overflow-hidden z-[2]">
					<input
						value={title}
						ref={inputRef}
						onChange={updateTitle}
						className="bg-transparent text-xl rounded-lg w-full p-1 px-2 text-black/60 dark:text-white/60"
						onKeyDown={e => {
							if (e.key !== 'Enter') return
							;(e.target as HTMLInputElement).blur()
						}}
					/>
				</div>
			</motion.div>
			<div
				className={classNames(
					headerPinned &&
						'opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300',
					'flex items-center space-x-1 flex-shrink-0'
				)}
			>
				<button
					onClick={replaceImage}
					className="bg-gray-200/60 dark:bg-gray-700/60 rounded p-1 opacity-80 hover:opacity-100 transition-opacity"
				>
					<UploadIcon className="w-4 h-4" />
				</button>
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

type CreateTypes = { url: string; name?: string; mimeType: string; point?: Point; names?: string[] }

export const createImageCard = (camera: Camera, { url, name, mimeType, point, names }: CreateTypes): ImageCard => {
	return {
		id: randomId(),
		type: CardType.FILE,
		size: { width: 500, height: 500 },
		attributes: { url, mimeType, title: names ? getName(name ?? 'Untitled', names) : name ?? 'Untitled' },
		point: screenToCanvas(point ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 }, camera),
	}
}

export default memo(ImageCard)
