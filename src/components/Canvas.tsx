import DevMode from './DevMode'
import CanvasItem from './CanvasItem'
import { isOnScreen } from '@/lib/canvas'
import { Menu } from '@/types/right-click'
import { getNamedCards } from '@/lib/cards'
import LoadingScreen from './LoadingScreen'
import { useAddCard } from '@/hooks/useCard'
import RightClickMenu from './RightClickMenu'
import BackgroundGrid from './BackgroundGrid'
import { uploadFile } from '@/lib/file-upload'
import { useStorage } from '@liveblocks/react'
import { createURLCard } from './Cards/URLCard'
import { createTextCard } from './Cards/TextCard'
import { createFileCard } from './Cards/FileCard'
import MultiplayerCursors from './MultiplayerCursors'
import { IMAGE_TYPES, VIDEO_TYPES } from '@/lib/consts'
import { AnimatePresence, motion } from 'framer-motion'
import useCamera, { CameraStore } from '@/store/camera'
import { ask, classNames, requestFile } from '@/lib/utils'
import { FC, memo, useEffect, useMemo, useRef } from 'react'
import useCreateOnDrop from '@/hooks/canvas/useCreateOnDrop'
import useCreateOnPaste from '@/hooks/canvas/useCreateOnPaste'
import useCameraGestures from '@/hooks/canvas/useCameraGestures'
import usePreventGestures from '@/hooks/canvas/usePreventGestures'
import useCanvasCommands from '@/hooks/command-bar/useCanvasCommands'
import { PhotoIcon, VideoCameraIcon, DocumentPlusIcon, LinkIcon } from '@heroicons/react/16/solid'

const getParams = (store: CameraStore) => ({
	camera: store.camera,
	shouldTransition: store.isTransitioning,
	setTransition: store.setTransitioning,
})

const Canvas: FC = () => {
	const addCard = useAddCard()
	const canvasRef = useRef<HTMLDivElement>()
	const cards = useStorage(root => root.cards)
	const { camera, shouldTransition, setTransition } = useCamera(getParams)

	const menu = useMemo<Menu>(() => {
		if (!cards) return []

		return [
			{
				label: 'Add',
				submenu: [
					{
						label: 'Note',
						icon: <DocumentPlusIcon className="w-3.5 h-3.5" />,
						action: async (_, point) => {
							addCard(
								createTextCard(camera, {
									point,
									names: getNamedCards(cards).map(({ attributes: { title } }) => title),
								})
							)
						},
					},
					{
						label: 'Link',
						icon: <LinkIcon className="w-3.5 h-3.5" />,
						action: async (_, point) => {
							addCard(createURLCard(camera, { url: await ask('What URL should we add?'), point }))
						},
					},
					{
						label: 'Image',
						icon: <PhotoIcon className="w-3.5 h-3.5" />,
						action: async (_, point) => {
							const file = await requestFile(IMAGE_TYPES)

							addCard(
								createFileCard(camera, {
									point,
									name: file.name,
									mimeType: file.type,
									url: await uploadFile(file),
									names: getNamedCards(cards).map(({ attributes: { title } }) => title),
								})
							)
						},
					},
					{
						label: 'Video',
						icon: <VideoCameraIcon className="w-3.5 h-3.5" />,
						action: async (_, point) => {
							const file = await requestFile(VIDEO_TYPES)

							addCard(
								createFileCard(camera, {
									point,
									name: file.name,
									mimeType: file.type,
									url: await uploadFile(file),
									names: getNamedCards(cards).map(({ attributes: { title } }) => title),
								})
							)
						},
					},
				],
			},
		]
	}, [cards, camera])

	useCreateOnDrop()
	useCreateOnPaste()
	useCanvasCommands()
	usePreventGestures()
	useCameraGestures(canvasRef)

	useEffect(() => {
		if (!cards) return

		cards.forEach(({ id, point, size }) => {
			const onScreen = isOnScreen(camera, point, size)
			const el = document.querySelector<HTMLDivElement>(`[data-card-id="${id}"]`)

			if (!el) return
			el.style.contentVisibility = onScreen ? null : 'hidden'
		})
	}, [cards, camera])

	const CardRenderer = useMemo(
		() => [...(cards ?? [])].reverse().map(card => <CanvasItem card={card} id={card.id} key={card.id} />),
		[cards]
	)

	return (
		<>
			<LoadingScreen loading={!cards} />
			<main ref={canvasRef} className="fixed w-full h-full inset-0 touch-none [contain:strict] z-0">
				<BackgroundGrid />
				<DevMode />
				<MultiplayerCursors canvas={canvasRef} />
				<motion.div
					transformTemplate={({ scale, x, y }) =>
						`scale(${scale}) translateX(${x}) translateY(${y}) translateZ(0px)`
					}
					className={classNames(
						shouldTransition && 'transition-transform duration-1000',
						'absolute will-change-transform'
					)}
					onTransitionEnd={() => setTransition(false)}
					style={{ scale: camera.z, x: camera.x, y: camera.y }}
				>
					<div className="pointer-events-[all]">
						<AnimatePresence>{CardRenderer}</AnimatePresence>
					</div>
				</motion.div>
				<RightClickMenu menu={menu}>
					<div className="fixed inset-0 -z-10" />
				</RightClickMenu>
			</main>
		</>
	)
}

export default memo(Canvas)
