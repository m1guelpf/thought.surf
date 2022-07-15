import { useEffect, useState } from 'react'
import ResizeIcon from './Icons/ResizeIcon'
import { Point, Size } from '@/types/canvas'
import { Sections } from '@/types/command-bar'
import { useGesture } from '@use-gesture/react'
import { LiveObject } from '@liveblocks/client'
import { useCamera } from '@/context/CanvasContext'
import useRegisterAction from '@/hooks/useRegisterAction'
import { addPoint, subPoint, zoomOn } from '@/lib/canvas'
import { DocumentTextIcon } from '@heroicons/react/outline'
import { useHistory, useRoom, useUpdateMyPresence } from '@/lib/liveblocks'
import { memo, MutableRefObject, FC, PropsWithChildren, useRef } from 'react'

const CanvasItem: FC<PropsWithChildren<{ id: string; item: LiveObject<{ point: Point; size: Size }> }>> = ({
	id,
	children,
	item,
}) => {
	const room = useRoom()
	const history = useHistory()
	const updateMyPresence = useUpdateMyPresence()
	const containerRef = useRef<HTMLDivElement>(null)
	const { camera, setCamera, setTransitioning } = useCamera()
	const dragData = useRef<{ start: Point; origin: Point }>(null)
	const [{ point, size }, setItem] = useState(item.toObject())

	useEffect(() => {
		function onChange() {
			setItem(item.toObject())
		}

		return room.subscribe(item, onChange)
	}, [room, item])

	const kbarAction = {
		id: `canvas-item-${id}`,
		name: 'Untitled',
		icon: <DocumentTextIcon />,
		parent: 'canvas',
		section: Sections.Canvas,
		perform: () => {
			const rect = containerRef.current.getBoundingClientRect()
			setTransitioning(true)
			setCamera(camera => zoomOn(camera, item.get('point'), { width: rect.width, heigth: rect.height }))
		},
	}

	useRegisterAction(kbarAction, [item])

	useGesture(
		{
			onPointerDown: ({ event }) => {
				updateMyPresence({ selectedItem: id }, { addToHistory: true })
				if (event.target != event.currentTarget) return
				const target = event.currentTarget as HTMLDivElement

				history.pause()
				target.setPointerCapture(event.pointerId)
				target.style.setProperty('cursor', 'grabbing')
				target.style.setProperty('z-index', '2')
				target.style.setProperty('--scale', '0.95')

				dragData.current = {
					start: item.get('point'),
					origin: { x: event.clientX / camera.z, y: event.clientY / camera.z },
				}
			},
			onPointerMove: ({ event }) => {
				if (!dragData.current) return

				const delta = subPoint(
					{ x: event.clientX / camera.z, y: event.clientY / camera.z },
					dragData.current.origin
				)

				item.update({ point: addPoint(dragData.current.start, delta) })
			},
			onPointerUp: ({ event }) => {
				updateMyPresence({ selectedItem: null }, { addToHistory: true })
				const target = event.currentTarget as HTMLDivElement

				history.resume()
				target.releasePointerCapture(event.pointerId)
				target.style.setProperty('cursor', 'grab')
				target.style.setProperty('z-index', '0')
				target.style.setProperty('--scale', '1')

				dragData.current = null
			},
		},
		{ target: containerRef, eventOptions: { passive: false } }
	)

	return (
		<div
			ref={containerRef}
			className="group p-3 min-w-[300px] min-h-[150px] bg-white/50 dark:bg-white/10 absolute will-change-transform cursor-grab [content-visibility:auto] [contain:layout_style_paint] rounded-lg shadow-md backdrop-blur backdrop-filter"
			style={
				{
					'--scale': '1',
					width: size.width,
					height: size.heigth,
					transform: `translate(${point.x}px, ${point.y}px) scale(var(--scale))`,
				} as React.CSSProperties
			}
		>
			<ResizeButton item={item} containerRef={containerRef} />
			{children}
		</div>
	)
}

const ResizeButton: FC<{
	item: LiveObject<{ point: Point; size: Size }>
	containerRef: MutableRefObject<HTMLDivElement>
}> = ({ item, containerRef }) => {
	const history = useHistory()
	const { camera } = useCamera()
	const resizeData = useRef<{ start: Point; origin: Point }>(null)

	const listeners = useGesture(
		{
			onPointerDown: ({ event }) => {
				history.pause()
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

				item.update({
					size: {
						width: resizeData.current.start.x + event.clientX / camera.z - resizeData.current.origin.x,
						heigth: resizeData.current.start.y + event.clientY / camera.z - resizeData.current.origin.y,
					},
				})
			},
			onPointerUp: ({ event }) => {
				if (!resizeData.current) return

				history.resume()
				resizeData.current = null
				;(event.target as HTMLDivElement).releasePointerCapture(event.pointerId)
			},
		},
		{ eventOptions: {} }
	)

	return (
		<button
			{...listeners()}
			className="opacity-0 group-hover:opacity-100 transition-opacity absolute bg-gray-100 dark:bg-black/30 bottom-2 right-2 cursor-se-resize flex items-center justify-center dark:shadow rounded p-2"
		>
			<ResizeIcon className="w-2 h-2 text-gray-900 dark:text-gray-100" />
		</button>
	)
}

export default memo(CanvasItem)
