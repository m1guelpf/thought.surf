import Cursor from './Cursor'
import DevMode from './DevMode'
import CanvasItem from './CanvasItem'
import { classNames } from '@/lib/utils'
import { FC, Fragment, useRef } from 'react'
import { CURSOR_COLORS } from '@/lib/consts'
import LoadingIcon from './Icons/LoadingIcon'
import { Transition } from '@headlessui/react'
import { useCamera } from '@/context/CanvasContext'
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
			<Transition
				as={Fragment}
				show={!items}
				enter="transition-opacity duration-75"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-700"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div
					className={`absolute w-screen h-screen inset-0 flex flex-col items-center justify-center cursor-wait z-50 bg-white/10 backdrop-filter backdrop-blur saturate-150`}
				>
					<LoadingIcon className="w-32 h-32" />
					<p className="-mt-6 ml-3 select-none text-2xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-br from-purple-300 to-purple-700">
						Loading...
					</p>
				</div>
			</Transition>
			<main ref={canvasRef} className="fixed w-full h-full inset-0 touch-none [contain:strict] z-0">
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
						shouldTransition && 'transition-transform duration-1000',
						'absolute will-change-transform'
					)}
					onTransitionEnd={onTransitionEnd}
					style={{ transform: `scale(${camera.z}) translate3d(${camera.x}px, ${camera.y}px, 0)` }}
				>
					<Transition
						as={Fragment}
						show={!!items}
						enter="transition-opacity duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
					>
						<div className="opacity-100 pointer-events-[all] transition-opacity">
							{items &&
								Array.from(items, ([itemId, item]) => (
									<CanvasItem
										key={itemId}
										id={itemId}
										item={item}
										onDelete={() => items.delete(itemId)}
									/>
								))}
						</div>
					</Transition>
				</div>
			</main>
		</>
	)
}

export default Canvas
