import { useGesture, usePinch, useWheel } from '@use-gesture/react'
import { panCamera, Point, zoomCamera } from '@/lib/canvas'
import { FC, useEffect, useRef, useState } from 'react'
import CanvasItem from './CanvasItem'
import { useCamera } from '@/context/CanvasContext'

type Item = {
	id: string
	point: Point
	size: { width: number; heigth: number }
}

const Canvas: FC<{}> = ({}) => {
	const { camera, setCamera } = useCamera()
	const canvasRef = useRef<HTMLDivElement>()
	const rDragging = useRef<{
		item: Item
		origin: Point
	} | null>(null)
	const [items, setItems] = useState<Record<string, Item>>({
		a: {
			id: 'a',
			point: { x: 200, y: 200 },
			size: { width: 300, heigth: 300 },
		},
		b: {
			id: 'b',
			point: { x: 320, y: 200 },
			size: { width: 240, heigth: 600 },
		},
		c: {
			id: 'c',
			point: { x: 50, y: 70 },
			size: { width: 524, heigth: 300 },
		},
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
			onDrag: ({ event, direction, delta, memo }) => {
				if (event.target != event.currentTarget) return

				setCamera(panCamera(camera, delta[0] * -1, delta[1] * -1))
			},
			onPinch: ({ event, origin, memo, direction }) => {
				console.log({ origin, direction })
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
