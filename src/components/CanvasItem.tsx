import { motion } from 'framer-motion'
import { Point } from '@/types/canvas'
import ResizeIcon from './Icons/ResizeIcon'
import { useGesture } from '@use-gesture/react'
import { LiveObject } from '@liveblocks/client'
import { XIcon } from '@heroicons/react/outline'
import { useCamera } from '@/context/CanvasContext'
import { useHistory, useRoom } from '@/lib/liveblocks'
import URLCard, { urlCardOptions } from './Cards/URLCard'
import { addPoint, subPoint, zoomOn } from '@/lib/canvas'
import { Card, CardOptions, CardType } from '@/types/cards'
import TextCard, { textCardOptions } from './Cards/TextCard'
import EmptyCard, { emptyCardOptions } from './Cards/EmptyCard'
import { useCallback, useEffect, useState, memo, MutableRefObject, FC, useRef, ReactNode } from 'react'

const CardRenderers: Record<string, (props) => ReactNode> = {
	[CardType.EMPTY]: props => <EmptyCard {...props} />,
	[CardType.TEXT]: props => <TextCard {...props} />,
	[CardType.URL]: props => <URLCard {...props} />,
}

const CardOptions: Record<CardType, CardOptions> = {
	[CardType.EMPTY]: emptyCardOptions,
	[CardType.TEXT]: textCardOptions,
	[CardType.URL]: urlCardOptions,
}

const CanvasItem: FC<{ id: string; item: LiveObject<Card>; onDelete: () => unknown }> = ({ id, item, onDelete }) => {
	const room = useRoom()
	const history = useHistory()
	const [scale, setScale] = useState(1)
	const containerRef = useRef<HTMLDivElement>(null)
	const { camera, setCamera, withTransition } = useCamera()
	const dragData = useRef<{ start: Point; origin: Point }>(null)
	const [{ point, size, type }, setItem] = useState(item.toObject())

	const navigateTo = useCallback(() => {
		const rect = containerRef.current.getBoundingClientRect()

		withTransition(() => {
			setCamera(camera => zoomOn(camera, item.get('point'), { width: rect.width, height: rect.height }))
		})
	}, [item, setCamera, withTransition])

	useEffect(() => {
		function onChange() {
			setItem(item.toObject())
		}

		return room.subscribe(item, onChange)
	}, [room, item])

	useGesture(
		{
			onPointerDown: ({ event }) => {
				// hack to ignore bubbled pointer events
				if (event.target != event.currentTarget) {
					if (!CardOptions[type].childrenDraggable) return
					if ((event.target as HTMLDivElement).closest('[data-no-drag]')) return
				}

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

	return (
		<motion.div
			ref={containerRef}
			animate={{ scale }}
			className="group p-3 min-w-[300px] min-h-[150px] bg-white/50 dark:bg-gray-900/90 absolute will-change-transform cursor-grab [content-visibility:auto] [contain:layout_style_paint] rounded-lg shadow-card backdrop-blur backdrop-filter"
			style={{
				width: size.width,
				height: size.height,
				x: point.x,
				y: point.y,
				scale,
			}}
		>
			<button
				onClick={onDelete}
				className="opacity-0 group-hover:opacity-100 transition-opacity absolute bg-white/30 shadow dark:bg-black/60 top-2 right-2 flex items-center justify-center dark:shadow rounded p-1 z-20"
				data-no-drag
			>
				<XIcon className="w-4 h-4 text-gray-900 dark:text-gray-100" />
			</button>
			<ResizeButton item={item} containerRef={containerRef} />
			{CardRenderers[type]({ item, id, navigateTo })}
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
			data-no-drag
			className="opacity-0 z-20 group-hover:opacity-100 transition-opacity absolute bg-white shadow dark:bg-black/60 bottom-2 right-2 cursor-se-resize flex items-center justify-center dark:shadow rounded p-2"
		>
			<ResizeIcon className="w-2 h-2 text-gray-900 dark:text-gray-100" />
		</button>
	)
})
ResizeButton.displayName = 'ResizeButton'

export default memo(CanvasItem)
