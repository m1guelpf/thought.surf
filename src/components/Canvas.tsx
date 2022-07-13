import { FC, useRef } from 'react'
import CanvasItem from './CanvasItem'
import { useCamera } from '@/context/CanvasContext'
import { panCamera, zoomCamera } from '@/lib/canvas'
import { useGesture, useWheel } from '@use-gesture/react'

const Canvas: FC<{ items: [] }> = ({ items }) => {
	const { camera, setCamera } = useCamera()
	const canvasRef = useRef<HTMLDivElement>()

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
			onPinch: ({ origin, direction }) => {
				setCamera(zoomCamera(camera, { x: origin[0], y: origin[1] }, 0.05 * -direction[1]))
			},
		},
		{ target: canvasRef }
	)

	return (
		<main ref={canvasRef} className="fixed w-full h-full inset-0 touch-none [contain:strict]">
			<div
				className="absolute will-change-transform"
				style={{ transform: `scale(${camera.z}) translate(${camera.x}px, ${camera.y}px)` }}
			>
				<div className="opacity-100 pointer-events-[all] transition-opacity">
					{Object.values(items).map(item => (
						<CanvasItem key={item.id} startPoint={item.point} startSize={item.size} />
					))}
				</div>
			</div>
		</main>
	)
}

export default Canvas
