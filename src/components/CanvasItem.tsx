import { useCamera } from '@/context/CanvasContext'
import { addPoint, Point, subPoint } from '@/lib/canvas'
import { useGesture } from '@use-gesture/react'
import { Dispatch, memo, MutableRefObject, SetStateAction, useEffect } from 'react'
import { useState } from 'react'
import { FC, PropsWithChildren, useRef } from 'react'
import ResizeIcon from './Icons/ResizeIcon'

type Size = { width: number; heigth: number }

const CanvasItem: FC<PropsWithChildren<{ startPoint: Point; startSize: Size }>> = ({
	children,
	startPoint,
	startSize,
}) => {
	const { camera } = useCamera()
	const containerRef = useRef<HTMLDivElement>(null)
	const dragData = useRef<{ start: Point; origin: Point }>(null)
	const [point, setPoint] = useState<Point>(startPoint)
	const [size, setSize] = useState<Size>(startSize)

	useEffect(() => {
		setPoint(startPoint)
	}, [startPoint])

	useEffect(() => {
		setSize(startSize)
	}, [startSize])

	useGesture(
		{
			onPointerDown: ({ event }) => {
				if (event.target != event.currentTarget) return
				const target = event.currentTarget as HTMLDivElement

				target.setPointerCapture(event.pointerId)
				target.style.setProperty('cursor', 'grabbing')
				target.style.setProperty('--scale', '0.95')

				dragData.current = {
					start: point,
					origin: { x: event.clientX / camera.z, y: event.clientY / camera.z },
				}
			},
			onPointerMove: ({ event }) => {
				if (!dragData.current) return

				const delta = subPoint(
					{ x: event.clientX / camera.z, y: event.clientY / camera.z },
					dragData.current.origin
				)

				setPoint(addPoint(dragData.current.start, delta))
			},
			onPointerUp: ({ event }) => {
				const target = event.currentTarget as HTMLDivElement

				target.releasePointerCapture(event.pointerId)
				target.style.setProperty('cursor', 'grab')
				target.style.setProperty('--scale', '1')

				dragData.current = null
			},
		},
		{ target: containerRef, eventOptions: { passive: false } }
	)

	return (
		<div
			ref={containerRef}
			className="p-3 min-w-[300px] min-h-[150px] bg-gray-800/90 absolute will-change-transform cursor-grab [content-visibility:auto] [contain:layout_style_paint] rounded-lg shadow-md backdrop-blur backdrop-filter"
			style={
				{
					'--scale': '1',
					width: size.width,
					height: size.heigth,
					transform: `translate(${point.x}px, ${point.y}px) scale(var(--scale))`,
				} as React.CSSProperties
			}
		>
			<ResizeButton setSize={setSize} containerRef={containerRef} />
			{children}
		</div>
	)
}

const ResizeButton: FC<{ setSize: Dispatch<SetStateAction<Size>>; containerRef: MutableRefObject<HTMLDivElement> }> = ({
	setSize,
	containerRef,
}) => {
	const { camera } = useCamera()
	const resizeData = useRef<{ start: Point; origin: Point }>(null)

	const listeners = useGesture(
		{
			onPointerDown: ({ event }) => {
				;(event.target as HTMLDivElement).setPointerCapture(event.pointerId)

				resizeData.current = {
					start: {
						x: parseInt(getComputedStyle(containerRef.current).width, 10),
						y: parseInt(getComputedStyle(containerRef.current).height, 10),
					},
					origin: { x: event.clientX / camera.z, y: event.clientY / camera.z },
				}
			},
			onPointerMove: ({ event }) => {
				if (!resizeData.current) return

				setSize({
					width: resizeData.current.start.x + event.clientX / camera.z - resizeData.current.origin.x,
					heigth: resizeData.current.start.y + event.clientY / camera.z - resizeData.current.origin.y,
				})
			},
			onPointerUp: ({ event }) => {
				if (!resizeData.current) return
				;(event.target as HTMLDivElement).releasePointerCapture(event.pointerId)
				resizeData.current = null
			},
		},
		{ eventOptions: {} }
	)

	return (
		<button
			{...listeners()}
			className="absolute bg-gray-700 bottom-2 right-2 cursor-se-resize flex items-center justify-center shadow rounded p-2"
		>
			<ResizeIcon className="w-2 h-2 text-gray-100" />
		</button>
	)
}

export default memo(CanvasItem)
