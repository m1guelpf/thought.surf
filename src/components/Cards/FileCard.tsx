import Card from '../Card'
import Video from '../Video'
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
import AutosizeInput from 'react-18-input-autosize'
import InputFieldIcon from '../Icons/InputFieldIcon'
import useRegisterAction from '@/hooks/useRegisterAction'
import { IMAGE_TYPES, OTHER_TYPES, VIDEO_TYPES } from '@/lib/consts'
import { capitalize, classNames, randomId, requestFile } from '@/lib/utils'
import { CardOptions, CardType, ImageCard as FileCard } from '@/types/cards'
import { FC, memo, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { XIcon, PhotographIcon, UploadIcon, VideoCameraIcon, DocumentIcon } from '@heroicons/react/solid'
import {
	PhotographIcon as PhotographMenuIcon,
	VideoCameraIcon as VideoMenuIcon,
	DocumentIcon as DocumentMenuIcon,
} from '@heroicons/react/outline'

type Props = {
	id: string
	onReorder: () => void
	navigateTo: () => void
	onDelete: () => unknown
	card: LiveObject<FileCard>
	containerRef: MutableRefObject<HTMLDivElement>
}

const FileCard: FC<Props> = ({ id, card, onDelete, navigateTo, onReorder, containerRef }) => {
	const titleInputRef = useRef<AutosizeInput>(null)
	const [isLoaded, setLoaded] = useState<boolean>(false)
	const {
		headerPinned,
		attributes: { url, title, mimeType },
	} = useCard(card)

	const type = useMemo<'image' | 'video' | 'pdf'>(() => {
		if (IMAGE_TYPES.includes(mimeType)) return 'image'
		if (VIDEO_TYPES.includes(mimeType)) return 'video'
		if (mimeType === 'application/pdf') return 'pdf'
	}, [mimeType])

	const replaceFile = useCallback(async () => {
		const file = await requestFile(type == 'image' ? IMAGE_TYPES : type == 'video' ? VIDEO_TYPES : OTHER_TYPES)

		card.update({
			attributes: {
				mimeType: file.type,
				url: await uploadFile(file),
				title: card.get('attributes').title,
			},
		})
	}, [card, type])

	useEffect(() => {
		setLoaded(false)
	}, [url])

	useRegisterAction(
		{
			name: title,
			parent: 'canvas',
			perform: navigateTo,
			id: `canvas-item-${id}`,
			section: Sections.Canvas,
			icon: type == 'image' ? <PhotographIcon /> : type == 'video' ? <VideoCameraIcon /> : <DocumentIcon />,
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
					checked: headerPinned,
					icon: <HeaderTopIcon className="h-3.5 w-3.5" />,
					onChange: headerPinned => card.update({ headerPinned }),
				},
			],
		}),
		[card, type, headerPinned, replaceFile]
	)

	const Header = useMemo(
		() => <CardHeader card={card} onDelete={onDelete} replaceFile={replaceFile} inputRef={titleInputRef} />,
		[card, replaceFile, onDelete, titleInputRef]
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
			{type == 'image' ? (
				<img
					onLoad={() => setLoaded(true)}
					alt={title}
					draggable="false"
					src={url}
					className="h-full w-full rounded-lg block object-cover select-none pointer-events-none"
				/>
			) : type == 'video' ? (
				<Video
					inline
					src={url}
					draggable="false"
					onReady={() => setLoaded(true)}
					style={{ borderRadius: '0.5rem', overflow: 'hidden' }}
					className="h-full w-full rounded-lg block object-cover select-none pointer-events-none overflow-hidden"
				/>
			) : (
				<iframe
					onLoad={() => setLoaded(true)}
					draggable="false"
					src={url}
					className="h-full w-full rounded-lg block object-cover select-none pointer-events-none"
				/>
			)}
			{!isLoaded && <Skeleton width="100%" height="100%" className="absolute inset-0 rounded-lg block" />}
		</Card>
	)
}

type CardHeaderProps = {
	onDelete: () => void
	replaceFile: () => void
	card: LiveObject<FileCard>
	inputRef: MutableRefObject<AutosizeInput>
}

const CardHeader: FC<CardHeaderProps> = memo(({ card, replaceFile, onDelete, inputRef }) => {
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
					<AutosizeInput
						value={title}
						ref={inputRef}
						onChange={updateTitle}
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
					headerPinned &&
						'opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300',
					'flex items-center space-x-1 flex-shrink-0'
				)}
			>
				<button
					onClick={replaceFile}
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

export const createFileCard = (camera: Camera, { url, name, mimeType, point, names }: CreateTypes): FileCard => {
	return {
		id: randomId(),
		type: CardType.FILE,
		size: { width: 500, height: 500 },
		attributes: { url, mimeType, title: names ? getName(name ?? 'Untitled', names) : name ?? 'Untitled' },
		point: screenToCanvas(point ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 }, camera),
	}
}

export default memo(FileCard)