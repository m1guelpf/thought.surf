import Cursor from './Cursor'
import DevMode from './DevMode'
import { FC, useRef } from 'react'
import CanvasItem from './CanvasItem'
import { classNames } from '@/lib/utils'
import LoadingScreen from './LoadingScreen'
import { CURSOR_COLORS } from '@/lib/consts'
import { useCamera } from '@/context/CanvasContext'
import { AnimatePresence, motion } from 'framer-motion'
import { useGesture, useWheel } from '@use-gesture/react'
import { panCamera, screenToCanvas, zoomCamera } from '@/lib/canvas'
import useCanvasCommands from '@/hooks/command-bar/useCanvasCommands'
import { useMap, useOthers, useUpdateMyPresence } from '@/lib/liveblocks'

const Canvas: FC = () => {
	const others = useOthers()
	const items = useMap('items')
	const canvasRef = useRef<HTMLDivElement>()
	const updateMyPresence = useUpdateMyPresence()
	const { camera, setCamera, shouldTransition, onTransitionEnd } = useCamera()

	useCanvasCommands(items)

	useWheel(
		({ event, ctrlKey, metaKey }) => {
			event.preventDefault()

			const { clientX: x, clientY: y, deltaX, deltaY } = event
			const isZoom = ctrlKey || metaKey
			console.log({ x, y })

			if (isZoom) setCamera(camera => zoomCamera(camera, { x, y }, deltaY / 100))
			else setCamera(camera => panCamera(camera, deltaX, deltaY))
		},
		{ target: canvasRef, eventOptions: { passive: false } }
	)

	useGesture(
		{
			onPointerMove: ({ event }) => {
				updateMyPresence({ cursor: screenToCanvas({ x: event.clientX, y: event.clientY }, camera) })
			},
			onDrag: ({ event, delta }) => {
				if (event.target != event.currentTarget) return

				setCamera(panCamera(camera, delta[0] * -1, delta[1] * -1))
			},
			onPinch: ({ origin, direction, event }) => {
				if (event.type === 'wheel') return

				setCamera(zoomCamera(camera, { x: origin[0], y: origin[1] }, 0.05 * -direction[1]))
			},
		},
		{ target: canvasRef }
	)

	return (
		<>
			<LoadingScreen loading={!items} />
			<main ref={canvasRef} className="fixed w-full h-full inset-0 touch-none [contain:strict] z-0">
				<DevMode />
				{others &&
					others.map(({ connectionId, presence }) => {
						if (!presence || !presence.cursor) return

						return (
							<Cursor
								key={connectionId}
								pos={presence.cursor}
								color={CURSOR_COLORS[connectionId % CURSOR_COLORS.length]}
							/>
						)
					})}
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
		</>
	)
}

export default Canvas
