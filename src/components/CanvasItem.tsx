import { motion } from 'framer-motion'
import ResizeIcon from './Icons/ResizeIcon'
import { Point } from '@/types/canvas'
import { Sections } from '@/types/command-bar'
import { useGesture } from '@use-gesture/react'
import { LiveObject } from '@liveblocks/client'
import { useCamera } from '@/context/CanvasContext'
import useRegisterAction from '@/hooks/useRegisterAction'
import { addPoint, subPoint, zoomOn } from '@/lib/canvas'
import { Card, CardOptions, CardType } from '@/types/cards'
import TextCard, { textCardOptions } from './Cards/TextCard'
import EmptyCard, { emptyCardOptions } from './Cards/EmptyCard'
import { DocumentTextIcon, XIcon } from '@heroicons/react/outline'
import { useHistory, useRoom, useUpdateMyPresence } from '@/lib/liveblocks'
import { useCallback, useEffect, useState, memo, MutableRefObject, FC, useRef } from 'react'

const CardRenderers = {
	[CardType.EMPTY]: props => <EmptyCard {...props} />,
	[CardType.TEXT]: props => <TextCard {...props} />,
}

const CardOptions: Record<CardType, CardOptions> = {
	[CardType.EMPTY]: emptyCardOptions,
	[CardType.TEXT]: textCardOptions,
}

const CanvasItem: FC<{ id: string; item: LiveObject<Card>; onDelete: () => unknown }> = ({ id, item, onDelete }) => {
	const room = useRoom()
	const history = useHistory()
	const [scale, setScale] = useState(1)
	const updateMyPresence = useUpdateMyPresence()
	const containerRef = useRef<HTMLDivElement>(null)
	const { camera, setCamera, withTransition } = useCamera()
	const dragData = useRef<{ start: Point; origin: Point }>(null)
	const [{ point, size, type }, setItem] = useState(item.toObject())

	useEffect(() => {
		function onChange() {
			setItem(item.toObject())
		}

		return room.subscribe(item, onChange)
	}, [room, item])

	useRegisterAction(
		{
			id: `canvas-item-${id}`,
			name: 'Untitled',
			icon: <DocumentTextIcon />,
			parent: 'canvas',
			section: Sections.Canvas,
			perform: () => {
				const rect = containerRef.current.getBoundingClientRect()

				withTransition(() => {
					setCamera(camera => zoomOn(camera, item.get('point'), { width: rect.width, height: rect.height }))
				})
			},
		},
		[item]
	)

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
				setScale(0.95)

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
				setScale(1)

				dragData.current = null
			},
		},
		{ target: containerRef, eventOptions: { passive: false } }
	)

	const deleteItem = useCallback(() => {
		updateMyPresence({ selectedItem: id }, { addToHistory: true })
		onDelete()
	}, [id, onDelete, updateMyPresence])

	return (
		<motion.div
			ref={containerRef}
			animate={{ scale }}
			className="group p-3 min-w-[300px] min-h-[150px] bg-white/50 dark:bg-white/10 absolute will-change-transform cursor-grab [content-visibility:auto] [contain:layout_style_paint] rounded-lg shadow-md backdrop-blur backdrop-filter"
			style={{
				width: size.width,
				height: size.height,
				x: point.x,
				y: point.y,
				scale,
			}}
		>
			<button
				onClick={deleteItem}
				className="opacity-0 group-hover:opacity-100 transition-opacity absolute bg-gray-100 dark:bg-black/60 top-2 right-2 flex items-center justify-center dark:shadow rounded p-1 z-20"
			>
				<XIcon className="w-4 h-4 text-gray-900 dark:text-gray-100" />
			</button>
			<ResizeButton item={item} containerRef={containerRef} />
			{CardRenderers[type]({ item, id })}
		</motion.div>
	)
}

const ResizeButton: FC<{
	item: LiveObject<Card>
	containerRef: MutableRefObject<HTMLDivElement>
}> = memo(({ item, containerRef }) => {
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

				const options = CardOptions[item.get('type')]
				const { width, height } = item.get('size')

				item.update({
					size: {
						width: options.resizeAxis.x
							? resizeData.current.start.x + event.clientX / camera.z - resizeData.current.origin.x
							: width,
						height: options.resizeAxis.y
							? resizeData.current.start.y + event.clientY / camera.z - resizeData.current.origin.y
							: height,
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
			className="opacity-0 z-20 group-hover:opacity-100 transition-opacity absolute bg-gray-100 dark:bg-black/60 bottom-2 right-2 cursor-se-resize flex items-center justify-center dark:shadow rounded p-2"
		>
			<ResizeIcon className="w-2 h-2 text-gray-900 dark:text-gray-100" />
		</button>
	)
})
ResizeButton.displayName = 'ResizeButton'

export default memo(CanvasItem)
