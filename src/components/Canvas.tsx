import DevMode from './DevMode'
import CanvasItem from './CanvasItem'
import shallow from 'zustand/shallow'
import { isOnScreen } from '@/lib/canvas'
import { useList } from '@/lib/liveblocks'
import { Menu } from '@/types/right-click'
import LoadingScreen from './LoadingScreen'
import RightClickMenu from './RightClickMenu'
import BackgroundGrid from './BackgroundGrid'
import { uploadFile } from '@/lib/file-upload'
import { createURLCard } from './Cards/URLCard'
import { LiveObject } from '@liveblocks/client'
import { createTextCard } from './Cards/TextCard'
import { createFileCard } from './Cards/FileCard'
import MultiplayerCursors from './MultiplayerCursors'
import { IMAGE_TYPES, VIDEO_TYPES } from '@/lib/consts'
import { AnimatePresence, motion } from 'framer-motion'
import useCamera, { CameraStore } from '@/store/camera'
import { findCardIndex, getNamedCards } from '@/lib/cards'
import { ask, classNames, requestFile } from '@/lib/utils'
import useCreateOnDrop from '@/hooks/canvas/useCreateOnDrop'
import useCreateOnPaste from '@/hooks/canvas/useCreateOnPaste'
import useCameraGestures from '@/hooks/canvas/useCameraGestures'
import { DocumentAddIcon, LinkIcon } from '@heroicons/react/solid'
import usePreventGestures from '@/hooks/canvas/usePreventGestures'
import useCanvasCommands from '@/hooks/command-bar/useCanvasCommands'
import { FC, memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { PhotographIcon, VideoCameraIcon } from '@heroicons/react/outline'

const getParams = (store: CameraStore) => ({
	camera: store.camera,
	shouldTransition: store.isTransitioning,
	setTransition: store.setTransitioning,
})

const Canvas: FC = () => {
	const cards = useList('cards')
	const canvasRef = useRef<HTMLDivElement>()
	const { camera, shouldTransition, setTransition } = useCamera(getParams, shallow)

	const menu = useMemo<Menu>(() => {
		if (!cards) return []

		return [
			{
				label: 'Add',
				submenu: [
					{
						label: 'Note',
						icon: <DocumentAddIcon className="w-3.5 h-3.5" />,
						action: async (_, point) => {
							cards.insert(
								new LiveObject(
									createTextCard(camera, {
										point,
										names: getNamedCards(cards).map(({ attributes: { title } }) => title),
									})
								),
								0
							)
						},
					},
					{
						label: 'Link',
						icon: <LinkIcon className="w-3.5 h-3.5" />,
						action: async (_, point) => {
							cards.insert(
								new LiveObject(
									createURLCard(camera, { url: await ask('What URL should we add?'), point })
								),
								0
							)
						},
					},
					{
						label: 'Image',
						icon: <PhotographIcon className="w-3.5 h-3.5" />,
						action: async (_, point) => {
							const file = await requestFile(IMAGE_TYPES)

							cards.insert(
								new LiveObject(
									createFileCard(camera, {
										point,
										name: file.name,
										mimeType: file.type,
										url: await uploadFile(file),
										names: getNamedCards(cards).map(({ attributes: { title } }) => title),
									})
								),
								0
							)
						},
					},
					{
						label: 'Video',
						icon: <VideoCameraIcon className="w-3.5 h-3.5" />,
						action: async (_, point) => {
							const file = await requestFile(VIDEO_TYPES)

							cards.insert(
								new LiveObject(
									createFileCard(camera, {
										point,
										name: file.name,
										mimeType: file.type,
										url: await uploadFile(file),
										names: getNamedCards(cards).map(({ attributes: { title } }) => title),
									})
								),
								0
							)
						},
					},
				],
			},
		]
	}, [cards, camera])

	useCreateOnDrop()
	useCreateOnPaste()
	usePreventGestures()
	useCanvasCommands(cards)
	useCameraGestures(canvasRef)

	const removeCard = useCallback(cardId => cards.delete(findCardIndex(cards, cardId)), [cards])
	const reorderCard = useCallback(
		cardId => {
			const cardIndex = findCardIndex(cards, cardId)
			if (cardIndex == 0) return

			cards.move(cardIndex, 0)
		},
		[cards]
	)

	useEffect(() => {
		if (!cards) return

		cards.forEach(card => {
			const { id, point, size } = card.toObject()
			const onScreen = isOnScreen(camera, point, size)
			const el = document.querySelector<HTMLDivElement>(`[data-card-id="${id}"]`)

			if (!el) return
			el.style.contentVisibility = onScreen ? null : 'hidden'
		})
	}, [cards, camera])

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
						<AnimatePresence>
							{cards
								?.toArray()
								?.reverse()
								?.map(card => (
									<CanvasItem
										key={card.get('id')}
										id={card.get('id')}
										card={card}
										removeCard={removeCard}
										reorderCard={reorderCard}
									/>
								))}
						</AnimatePresence>
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
