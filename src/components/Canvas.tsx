import Cursor from './Cursor'
import DevMode from './DevMode'
import { FC, useRef } from 'react'
import CanvasItem from './CanvasItem'
import { classNames } from '@/lib/utils'
import { CURSOR_COLORS } from '@/lib/consts'
import { LiveMap, Lson } from '@liveblocks/client'
import { useCamera } from '@/context/CanvasContext'
import { panCamera, zoomCamera } from '@/lib/canvas'
import { useGesture, useWheel } from '@use-gesture/react'
import useCanvasCommands from '@/hooks/command-bar/useCanvasCommands'
import { Presence, useMap, useOthers, useUpdateMyPresence } from '@/lib/liveblocks'

const Canvas: FC = () => {
	const items = useMap('items') as LiveMap<string, Lson> | null
	const canvasRef = useRef<HTMLDivElement>()
	const updateMyPresence = useUpdateMyPresence()
	const { camera, setCamera, isTransitioning, setTransitioning } = useCamera()
	const others = useOthers() as unknown as Array<{ connectionId: number; presence: Presence }>

	useCanvasCommands(items)

	useWheel(
		({ event, ctrlKey, metaKey }) => {
			event.preventDefault()

			const { clientX: x, clientY: y, deltaX, deltaY } = event
			const isZoom = ctrlKey || metaKey

			if (isZoom) setCamera(camera => zoomCamera(camera, { x, y }, deltaY / 100))
			else setCamera(camera => panCamera(camera, deltaX, deltaY))
		},
		{ target: canvasRef, eventOptions: { passive: false } }
	)

	useGesture(
		{
			onPointerMove: ({ event }) => {
				updateMyPresence({ cursor: { x: event.clientX, y: event.clientY } })
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
		<main ref={canvasRef} className="fixed w-full h-full inset-0 touch-none [contain:strict]">
			<DevMode />
			{others.map(({ connectionId, presence }) => {
				if (!presence || !presence.cursor) return

				return (
					<Cursor
						key={connectionId}
						pos={presence.cursor}
						color={CURSOR_COLORS[connectionId % CURSOR_COLORS.length]}
					/>
				)
			})}
			<div
				className={classNames(
					isTransitioning && 'transition-transform duration-1000',
					'absolute will-change-transform'
				)}
				onTransitionEnd={() => setTransitioning(false)}
				style={{ transform: `scale(${camera.z}) translate(${camera.x}px, ${camera.y}px)` }}
			>
				<div className="opacity-100 pointer-events-[all] transition-opacity">
					{items &&
						Array.from(items, ([itemId, item]) => (
							// @ts-ignore
							<CanvasItem key={itemId} id={itemId} item={item} />
						))}
				</div>
			</div>
		</main>
	)
}

export default Canvas
