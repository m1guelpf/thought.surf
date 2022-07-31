import DevMode from './DevMode'
import CanvasItem from './CanvasItem'
import { useMap } from '@/lib/liveblocks'
import { getTextCards } from '@/lib/cards'
import { Menu } from '@/types/right-click'
import LoadingScreen from './LoadingScreen'
import RightClickMenu from './RightClickMenu'
import { createURLCard } from './Cards/URLCard'
import { LiveObject } from '@liveblocks/client'
import { FC, memo, useMemo, useRef } from 'react'
import { createTextCard } from './Cards/TextCard'
import { createEmptyCard } from './Cards/EmptyCard'
import { useCamera } from '@/context/CanvasContext'
import MultiplayerCursors from './MultiplayerCursors'
import { ask, classNames, randomId } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import usePanGestures from '@/hooks/canvas/usePanGestures'
import useZoomGestures from '@/hooks/canvas/useZoomGestures'
import useCreateOnDrop from '@/hooks/canvas/useCreateOnDrop'
import useCreateOnPaste from '@/hooks/canvas/useCreateOnPaste'
import usePreventGestures from '@/hooks/canvas/usePreventGestures'
import useCanvasCommands from '@/hooks/command-bar/useCanvasCommands'
import { DocumentAddIcon, LinkIcon, ViewGridAddIcon } from '@heroicons/react/solid'

const Canvas: FC = () => {
	const items = useMap('items')
	const canvasRef = useRef<HTMLDivElement>()
	const { camera, shouldTransition, onTransitionEnd } = useCamera()

	const menu = useMemo<Menu>(() => {
		if (!items) return []

		return [
			{
				label: 'Add',
				submenu: [
					{
						label: 'Empty (testing)',
						icon: <ViewGridAddIcon className="w-3.5 h-3.5" />,
						action: (_, point) => {
							items.set(randomId(), new LiveObject(createEmptyCard(camera, { point })))
						},
					},
					{
						label: 'Note',
						icon: <DocumentAddIcon className="w-3.5 h-3.5" />,
						action: (_, point) => {
							items.set(
								randomId(),
								new LiveObject(
									createTextCard(camera, {
										point,
										names: getTextCards(items).map(({ attributes: { title } }) => title),
									})
								)
							)
						},
					},
					{
						label: 'Link',
						icon: <LinkIcon className="w-3.5 h-3.5" />,
						action: async (_, point) => {
							items.set(
								randomId(),
								new LiveObject(
									createURLCard(camera, { url: await ask('What URL should we add?'), point })
								)
							)
						},
					},
				],
			},
		]
	}, [items, camera])

	useCreateOnDrop()
	useCreateOnPaste()
	usePreventGestures()
	useCanvasCommands(items)
	usePanGestures(canvasRef)
	useZoomGestures(canvasRef)

	return (
		<>
			<LoadingScreen loading={!items} />
			<RightClickMenu menu={menu}>
				<main ref={canvasRef} className="fixed w-full h-full inset-0 touch-none [contain:strict] z-0">
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
						onTransitionEnd={onTransitionEnd}
						style={{ scale: camera.z, x: camera.x, y: camera.y }}
					>
						<div className="pointer-events-[all]">
							<AnimatePresence>
								{items &&
									Array.from(items, ([itemId, item]) => (
										<motion.div
											key={itemId}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
										>
											<CanvasItem id={itemId} item={item} onDelete={() => items.delete(itemId)} />
										</motion.div>
									))}
							</AnimatePresence>
						</div>
					</motion.div>
				</main>
			</RightClickMenu>
		</>
	)
}

export default memo(Canvas)
