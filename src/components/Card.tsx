import { motion } from 'framer-motion'
import { Point } from '@/types/canvas'
import { classNames } from '@/lib/utils'
import ResizeButton from './ResizeButton'
import { useRefCamera } from '@/store/camera'
import RightClickMenu from './RightClickMenu'
import { useHistory } from '@liveblocks/react'
import { useGesture } from '@use-gesture/react'
import { XMarkIcon } from '@heroicons/react/16/solid'
import { type Card, CardOptions } from '@/types/cards'
import { addPoint, eventAlreadyHandled, subPoint } from '@/lib/canvas'
import { useDeleteCard, useReorderCard, useUpdateCard } from '@/hooks/useCard'
import { FC, memo, MutableRefObject, PropsWithChildren, ReactNode, useRef, useState } from 'react'

type Props = {
	id: string
	card: Card
	unboxed?: boolean
	header?: ReactNode
	options: CardOptions
	containerRef: MutableRefObject<HTMLDivElement>
}

const Card: FC<PropsWithChildren<Props>> = ({ id, card, header, options, children, containerRef, unboxed = false }) => {
	const history = useHistory()
	const camera = useRefCamera()
	const updateCard = useUpdateCard(id)
	const [scale, setScale] = useState(1)
	const deleteCard = useDeleteCard(card.id)
	const reorderCard = useReorderCard(card.id)
	const cardRef = useRef<HTMLDivElement>(null)
	const dragData = useRef<{ start: Point; origin: Point; pointerId: number }>(null)

	useGesture(
		{
			onPointerDown: ({ event }) => {
				if (eventAlreadyHandled(event) || event.button == 2) return

				const target = event.currentTarget as HTMLDivElement

				history.pause()
				target.setPointerCapture(event.pointerId)
				target.style.setProperty('cursor', 'grabbing')
				target.style.setProperty('z-index', '2')
				setScale(0.99)

				dragData.current = {
					start: card.point,
					origin: { x: event.clientX / camera.current.z, y: event.clientY / camera.current.z },
					pointerId: event.pointerId,
				}
			},
			onPointerMove: ({ event }) => {
				if (!dragData.current) return

				const delta = subPoint(
					{ x: event.clientX / camera.current.z, y: event.clientY / camera.current.z },
					dragData.current.origin
				)

				updateCard({ point: addPoint(dragData.current.start, delta) })
			},
			onPointerUp: ({ event }) => {
				if (eventAlreadyHandled(event)) return
				const target = event.currentTarget as HTMLDivElement

				setScale(1)
				history.resume()
				target.style.setProperty('z-index', '0')
				target.style.setProperty('cursor', 'grab')
				target.releasePointerCapture(event.pointerId)

				reorderCard()
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
		{ target: cardRef, eventOptions: { passive: false } }
	)

	return (
		<motion.div
			ref={cardRef}
			data-card-id={id}
			exit={{ opacity: 0 }}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			style={{ x: card.point.x, y: card.point.y, width: card.size.width }}
			className="group absolute will-change-transform space-y-2 min-w-[300px]"
		>
			{header}
			<RightClickMenu
				menu={[
					...(options.menuItems ?? []),
					{ icon: <XMarkIcon className="h-3.5 w-3.5" />, label: 'Delete', action: deleteCard },
				]}
			>
				<motion.div
					ref={containerRef}
					animate={{ scale }}
					className={classNames(
						!unboxed && 'p-3',
						'min-w-[300px] min-h-[150px] bg-white/50 dark:bg-gray-900/90 cursor-grab rounded-lg shadow-card backdrop-blur backdrop-filter'
					)}
					style={{ scale, width: card.size.width, height: card.size.height }}
				>
					<ResizeButton resizeAxis={options.resizeAxis} card={card} containerRef={containerRef} />
					{children}
				</motion.div>
			</RightClickMenu>
		</motion.div>
	)
}

export default memo(Card)
