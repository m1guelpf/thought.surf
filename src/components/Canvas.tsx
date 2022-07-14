import { FC, useRef } from 'react'
import CanvasItem from './CanvasItem'
import { classNames } from '@/lib/utils'
import { Sections } from '@/types/command-bar'
import { useCamera } from '@/context/CanvasContext'
import { panCamera, zoomCamera } from '@/lib/canvas'
import useRegisterAction from '@/hooks/useRegisterAction'
import { useGesture, useWheel } from '@use-gesture/react'
import { DocumentSearchIcon } from '@heroicons/react/outline'

const Canvas: FC<{ items: [] }> = ({ items }) => {
	const { camera, setCamera, isTransitioning, setTransitioning } = useCamera()
	const canvasRef = useRef<HTMLDivElement>()

	useRegisterAction({
		id: 'search-canvas',
		name: 'Search Canvas...',
		subtitle: `${Object.values(items).length} items`,
		icon: <DocumentSearchIcon />,
		section: Sections.Canvas,
		shortcut: ['/'],
		keywords: 'search find',
	})

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
			<div
				className={classNames(
					isTransitioning && 'transition-transform duration-1000',
					'absolute will-change-transform'
				)}
				onTransitionEnd={() => setTransitioning(false)}
				style={{ transform: `scale(${camera.z}) translate(${camera.x}px, ${camera.y}px)` }}
			>
				<div className="opacity-100 pointer-events-[all] transition-opacity">
					{Object.values(items).map(item => (
						// @ts-ignore
						<CanvasItem key={item.id} id={item.id} startPoint={item.point} startSize={item.size} />
					))}
				</div>
			</div>
		</main>
	)
}

export default Canvas
