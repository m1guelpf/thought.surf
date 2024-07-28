import Card from '../Card'
import Video from '../Video'
import PinButton from '../PinButton'
import { getName } from '@/lib/names'
import { motion } from 'framer-motion'
import { screenToCanvas } from '@/lib/canvas'
import Skeleton from 'react-loading-skeleton'
import { Camera, Point } from '@/types/canvas'
import { uploadFile } from '@/lib/file-upload'
import { Sections } from '@/types/command-bar'
import { LiveObject } from '@liveblocks/client'
import HeaderTopIcon from '../Icons/HeaderTopIcon'
import AutosizeInput from 'react-18-input-autosize'
import InputFieldIcon from '../Icons/InputFieldIcon'
import useRegisterAction from '@/hooks/useRegisterAction'
import { useDeleteCard, useUpdateCard } from '@/hooks/useCard'
import { IMAGE_TYPES, OTHER_TYPES, VIDEO_TYPES } from '@/lib/consts'
import { capitalize, classNames, randomId, requestFile } from '@/lib/utils'
import { CardOptions, CardType, type ImageCard as FileCard } from '@/types/cards'
import { FC, memo, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { XMarkIcon, PhotoIcon, ArrowUpTrayIcon, VideoCameraIcon, DocumentIcon } from '@heroicons/react/16/solid'
import {
	PhotoIcon as PhotographMenuIcon,
	VideoCameraIcon as VideoMenuIcon,
	DocumentIcon as DocumentMenuIcon,
} from '@heroicons/react/24/outline'

type Props = {
	id: string
	card: FileCard
	navigateTo: () => void
	containerRef: MutableRefObject<HTMLDivElement>
}

const FileCard: FC<Props> = ({ id, card, navigateTo, containerRef }) => {
	const updateCard = useUpdateCard(id)
	const titleInputRef = useRef<AutosizeInput>(null)
	const [isLoaded, setLoaded] = useState<boolean>(false)

	const type = useMemo<'image' | 'video' | 'pdf'>(() => {
		if (IMAGE_TYPES.includes(card.attributes.mimeType)) return 'image'
		if (VIDEO_TYPES.includes(card.attributes.mimeType)) return 'video'
		if (card.attributes.mimeType === 'application/pdf') return 'pdf'
	}, [card.attributes.mimeType])

	const replaceFile = useCallback(async () => {
		const file = await requestFile(type == 'image' ? IMAGE_TYPES : type == 'video' ? VIDEO_TYPES : OTHER_TYPES)

		updateCard({
			attributes: {
				mimeType: file.type,
				url: await uploadFile(file),
				title: card.attributes.title,
			},
		})
	}, [card, type, updateCard])

	useEffect(() => {
		setLoaded(false)
	}, [card.attributes.url])

	useRegisterAction(
		{
			name: card.attributes.title,
			parent: 'canvas',
			perform: navigateTo,
			id: `canvas-item-${id}`,
			section: Sections.Canvas,
			icon: type == 'image' ? <PhotoIcon /> : type == 'video' ? <VideoCameraIcon /> : <DocumentIcon />,
		},
		[id, type, card.attributes.title]
	)

	const cardOptions = useMemo<CardOptions>(
		() => ({
			resizeAxis: { x: true, y: true },
			menuItems: [
				{
					label: 'Change Title',
					icon: <InputFieldIcon className="h-3.5 w-3.5" />,
					action: () => requestAnimationFrame(() => titleInputRef.current?.getInput?.()?.focus()),
				},
				{
					label: `Replace ${type == 'pdf' ? 'PDF' : capitalize(type)}`,
					action: replaceFile,
					icon:
						type == 'image' ? (
							<PhotographMenuIcon className="h-3.5 w-3.5" />
						) : type == 'video' ? (
							<VideoMenuIcon className="h-3.5 w-3.5" />
						) : (
							<DocumentMenuIcon className="h-3.5 w-3.5" />
						),
				},
				{
					label: 'Pin Header',
					checked: card.headerPinned,
					icon: <HeaderTopIcon className="h-3.5 w-3.5" />,
					onChange: headerPinned => updateCard({ headerPinned }),
				},
			],
		}),
		[card, type, replaceFile, updateCard]
	)

	const Header = useMemo(
		() => <CardHeader card={card} replaceFile={replaceFile} inputRef={titleInputRef} />,
		[card, replaceFile, titleInputRef]
	)

	return (
		<Card id={id} unboxed card={card} header={Header} options={cardOptions} containerRef={containerRef}>
			{type == 'image' ? (
				<img
					draggable="false"
					src={card.attributes.url}
					alt={card.attributes.title}
					onLoad={() => setLoaded(true)}
					className="h-full w-full rounded-lg block object-cover select-none pointer-events-none"
				/>
			) : type == 'video' ? (
				<Video
					inline
					draggable="false"
					src={card.attributes.url}
					onReady={() => setLoaded(true)}
					style={{ borderRadius: '0.5rem', overflow: 'hidden' }}
					className="h-full w-full rounded-lg block object-cover select-none pointer-events-none overflow-hidden"
				/>
			) : (
				<iframe
					draggable="false"
					src={card.attributes.url}
					onLoad={() => setLoaded(true)}
					className="h-full w-full rounded-lg block object-cover select-none pointer-events-none"
				/>
			)}
			{!isLoaded && <Skeleton width="100%" height="100%" className="absolute inset-0 rounded-lg block" />}
		</Card>
	)
}

type CardHeaderProps = {
	card: FileCard
	replaceFile: () => void
	inputRef: MutableRefObject<AutosizeInput>
}

const CardHeader: FC<CardHeaderProps> = memo(({ card, replaceFile, inputRef }) => {
	const updateCard = useUpdateCard(card.id)
	const deleteCard = useDeleteCard(card.id)

	const updatePinned = useCallback(headerPinned => updateCard({ headerPinned }), [card])
	const updateTitle = useCallback(
		event =>
			updateCard({
				attributes: {
					title: event.target.value,
					url: card.attributes.url,
					mimeType: card.attributes.mimeType,
				},
			}),
		[card]
	)

	return (
		<div
			className={classNames(
				!card.headerPinned && 'opacity-0 group-hover:opacity-100 focus-within:opacity-100',
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
					isPinned={card.headerPinned}
					onChange={updatePinned}
					hoverVariant="pinVisible"
				/>
				<div className="overflow-hidden z-[2]">
					<AutosizeInput
						ref={inputRef}
						onChange={updateTitle}
						value={card.attributes.title}
						inputClassName="bg-transparent text-xl rounded-lg w-full p-1 px-2 text-black/60 dark:text-white/60"
						onKeyDown={e => {
							if (e.key !== 'Enter') return
							;(e.target as HTMLInputElement).blur()
						}}
					/>
				</div>
			</motion.div>
			<div
				className={classNames(
					card.headerPinned &&
						'opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300',
					'flex items-center space-x-1 flex-shrink-0'
				)}
			>
				<button
					onClick={replaceFile}
					className="bg-gray-200/60 dark:bg-gray-700/60 rounded p-1 opacity-80 hover:opacity-100 transition-opacity"
				>
					<ArrowUpTrayIcon className="w-4 h-4" />
				</button>
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

type CreateTypes = { url: string; name?: string; mimeType: string; point?: Point; names?: string[] }

export const createFileCard = (camera: Camera, { url, name, mimeType, point, names }: CreateTypes): FileCard => {
	return {
		id: randomId(),
		type: CardType.FILE,
		size: { width: 500, height: 500 },
		attributes: { url, mimeType, title: names ? getName(name ?? 'Untitled', names) : (name ?? 'Untitled') },
		point: screenToCanvas(point ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 }, camera),
	}
}

export default memo(FileCard)
