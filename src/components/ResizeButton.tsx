import { Card } from '@/types/cards'
import { Point } from '@/types/canvas'
import ResizeIcon from './Icons/ResizeIcon'
import { useRefCamera } from '@/store/camera'
import { useHistory } from '@liveblocks/react'
import { useUpdateCard } from '@/hooks/useCard'
import { useGesture } from '@use-gesture/react'
import { FC, memo, MutableRefObject, useRef } from 'react'

const ResizeButton: FC<{
	card: Card
	resizeAxis: { x: boolean; y: boolean }
	containerRef: MutableRefObject<HTMLDivElement>
}> = ({ card, containerRef, resizeAxis }) => {
	const history = useHistory()
	const camera = useRefCamera()
	const updateCard = useUpdateCard(card.id)
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
					origin: { x: event.clientX / camera.current.z, y: event.clientY / camera.current.z },
				}
			},
			onPointerMove: ({ event }) => {
				if (!resizeData.current) return

				let { width, height } = card.size

				if (resizeAxis.x) {
					width = resizeData.current.start.x + event.clientX / camera.current.z - resizeData.current.origin.x
				}

				if (resizeAxis.y) {
					height = resizeData.current.start.y + event.clientY / camera.current.z - resizeData.current.origin.y
				}

				updateCard({ size: { width, height } })
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
			data-no-drag
			{...listeners()}
			className="opacity-0 z-20 group-hover:opacity-100 transition-opacity absolute bottom-0 right-0 cursor-se-resize flex items-center justify-center p-1"
		>
			<ResizeIcon className="w-2.5 h-2.5 text-gray-900 dark:text-gray-100" />
		</button>
	)
}

export default memo(ResizeButton)
