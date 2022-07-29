import { motion } from 'framer-motion'
import { Point } from '@/types/canvas'
import { classNames } from '@/lib/utils'
import ResizeIcon from './Icons/ResizeIcon'
import RightClickMenu from './RightClickMenu'
import { useGesture } from '@use-gesture/react'
import { LiveObject } from '@liveblocks/client'
import { XIcon } from '@heroicons/react/outline'
import { useCamera } from '@/context/CanvasContext'
import { useHistory, useRoom } from '@/lib/liveblocks'
import URLCard, { urlCardOptions } from './Cards/URLCard'
import { Card, CardOptions, CardType } from '@/types/cards'
import TextCard, { textCardOptions } from './Cards/TextCard'
import TweetCard, { tweetCardOptions } from './Cards/TweetCard'
import EmptyCard, { emptyCardOptions } from './Cards/EmptyCard'
import { addPoint, eventAlreadyHandled, isOnScreen, subPoint, zoomOn } from '@/lib/canvas'
import { useCallback, useEffect, useState, memo, MutableRefObject, FC, useRef, ReactNode } from 'react'

const CardRenderers: Record<string, (props) => ReactNode> = {
	[CardType.URL]: props => <URLCard {...props} />,
	[CardType.TEXT]: props => <TextCard {...props} />,
	[CardType.EMPTY]: props => <EmptyCard {...props} />,
	[CardType.TWEET]: props => <TweetCard {...props} />,
}

const CardOptions: Record<CardType, CardOptions> = {
	[CardType.URL]: urlCardOptions,
	[CardType.TEXT]: textCardOptions,
	[CardType.EMPTY]: emptyCardOptions,
	[CardType.TWEET]: tweetCardOptions,
}

const CanvasItem: FC<{ id: string; item: LiveObject<Card>; onDelete: () => unknown }> = ({ id, item, onDelete }) => {
	const room = useRoom()
	const history = useHistory()
	const [scale, setScale] = useState(1)
	const containerRef = useRef<HTMLDivElement>(null)
	const { camera, setCamera, withTransition } = useCamera()
	const [{ point, size, type }, setItem] = useState(item.toObject())
	const dragData = useRef<{ start: Point; origin: Point; pointerId: number }>(null)

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
				if (eventAlreadyHandled(event)) return

				const target = event.currentTarget as HTMLDivElement

				history.pause()
				target.setPointerCapture(event.pointerId)
				target.style.setProperty('cursor', 'grabbing')
				target.style.setProperty('z-index', '2')
				setScale(0.95)

				dragData.current = {
					start: item.get('point'),
					origin: { x: event.clientX / camera.z, y: event.clientY / camera.z },
					pointerId: event.pointerId,
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
				if (eventAlreadyHandled(event)) return
				const target = event.currentTarget as HTMLDivElement

				setScale(1)
				history.resume()
				target.style.setProperty('z-index', '0')
				target.style.setProperty('cursor', 'grab')
				target.releasePointerCapture(event.pointerId)

				dragData.current = null
			},
			onPointerOut: ({ event }) => {
				if (eventAlreadyHandled(event) || !dragData.current) return
				const target = event.currentTarget as HTMLDivElement

				setScale(1)
				history.resume()
				target.style.setProperty('z-index', '0')
				target.style.setProperty('cursor', 'grab')
				target.releasePointerCapture(dragData.current.pointerId)

				dragData.current = null
			},
		},
		{ target: containerRef, eventOptions: { passive: false } }
	)

	return (
		<RightClickMenu
			menu={[
				...(CardOptions[type].menuItems ?? []),
				{ icon: <XIcon className="h-3.5 w-3.5" />, label: 'Delete', action: onDelete },
			]}
		>
			<motion.div
				ref={containerRef}
				animate={{ scale }}
				className={classNames(
					isOnScreen(camera, point, size) ? '[content-visibility:auto]' : '[content-visibility:hidden]',
					'group p-3 min-w-[300px] min-h-[150px] bg-white/50 dark:bg-gray-900/90 absolute will-change-transform cursor-grab  [contain:layout_style_paint] rounded-lg shadow-card backdrop-blur backdrop-filter'
				)}
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
		</RightClickMenu>
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
