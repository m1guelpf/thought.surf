import useItem from '@/hooks/useItem'
import { motion } from 'framer-motion'
import { Point } from '@/types/canvas'
import { classNames } from '@/lib/utils'
import ResizeIcon from './Icons/ResizeIcon'
import RightClickMenu from './RightClickMenu'
import { useHistory } from '@/lib/liveblocks'
import { useGesture } from '@use-gesture/react'
import { LiveObject } from '@liveblocks/client'
import { XIcon } from '@heroicons/react/outline'
import { useCamera } from '@/context/CanvasContext'
import URLCard, { urlCardOptions } from './Cards/URLCard'
import { Card, CardOptions, CardType } from '@/types/cards'
import TextCard, { textCardOptions } from './Cards/TextCard'
import TweetCard, { tweetCardOptions } from './Cards/TweetCard'
import { addPoint, eventAlreadyHandled, isOnScreen, subPoint, zoomOn } from '@/lib/canvas'
import { useCallback, useState, memo, MutableRefObject, FC, useRef, ReactNode } from 'react'

const CardRenderers: Record<string, (props) => ReactNode> = {
	[CardType.URL]: props => <URLCard {...props} />,
	[CardType.TEXT]: props => <TextCard {...props} />,
	[CardType.TWEET]: props => <TweetCard {...props} />,
}

const CardOptions: Record<CardType, CardOptions> = {
	[CardType.URL]: urlCardOptions,
	[CardType.TEXT]: textCardOptions,
	[CardType.TWEET]: tweetCardOptions,
}

const CanvasItem: FC<{ id: string; item: LiveObject<Card>; onDelete: () => unknown }> = ({ id, item, onDelete }) => {
	const history = useHistory()
	const [scale, setScale] = useState(1)
	const { point, size, type } = useItem(item)
	const containerRef = useRef<HTMLDivElement>(null)
	const { camera, setCamera, withTransition } = useCamera()
	const dragData = useRef<{ start: Point; origin: Point; pointerId: number }>(null)

	const navigateTo = useCallback(() => {
		const rect = containerRef.current.getBoundingClientRect()

		withTransition(() => {
			setCamera(camera => zoomOn(camera, item.get('point'), { width: rect.width, height: rect.height }))
		})
	}, [item, setCamera, withTransition])

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
				style={{ scale, x: point.x, y: point.y, width: size.width, height: size.height }}
			>
				<ResizeButton item={item} containerRef={containerRef} />
				{CardRenderers[type]({ item, id, navigateTo, onDelete })}
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
			className="opacity-0 z-20 group-hover:opacity-100 transition-opacity absolute bottom-0 right-0 cursor-se-resize flex items-center justify-center p-1"
		>
			<ResizeIcon className="w-2.5 h-2.5 text-gray-900 dark:text-gray-100" />
		</button>
	)
})
ResizeButton.displayName = 'ResizeButton'

export default memo(CanvasItem)
