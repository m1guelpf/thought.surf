import { useGesture, useWheel } from '@use-gesture/react'
import { addPoint, Camera, panCamera, Point, subPoint, zoomCamera } from '@/lib/canvas'
import { FC, PropsWithChildren, useRef, useState } from 'react'
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

	const listeners = useGesture(
		{
			onPointerDown: ({ event }) => {
				const target = event.currentTarget as HTMLDivElement

				target.setPointerCapture(event.pointerId)
				target.style.setProperty('cursor', 'grabbing')
				target.style.setProperty('--scale', '0.95')

				rDragging.current = {
					item: items[target.id],
					origin: { x: event.clientX / camera.z, y: event.clientY / camera.z },
				}
			},
			onPointerMove: ({ event }) => {
				const dragging = rDragging.current
				if (!dragging) return

				const item = items[dragging.item.id]
				const delta = subPoint({ x: event.clientX / camera.z, y: event.clientY / camera.z }, dragging.origin)

				setItems({
					...items,
					[item.id]: {
						...item,
						point: addPoint(dragging.item.point, delta),
					},
				})
			},
			onPointerUp: ({ event }) => {
				const target = event.currentTarget as HTMLDivElement

				rDragging.current = null
				target.releasePointerCapture(event.pointerId)
				target.style.setProperty('cursor', 'grab')
				target.style.setProperty('--scale', '1')
			},
		},
		{ eventOptions: { passive: false } }
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
