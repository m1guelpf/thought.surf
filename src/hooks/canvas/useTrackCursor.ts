import { RefObject } from 'react'
import { screenToCanvas } from '@/lib/canvas'
import { useGesture } from '@use-gesture/react'
import { useCamera } from '@/context/CanvasContext'
import { useUpdateMyPresence } from '@/lib/liveblocks'

const useTrackCursor = (canvasRef: RefObject<HTMLDivElement>) => {
	const { camera } = useCamera()
	const updateMyPresence = useUpdateMyPresence()

	useGesture(
		{
			onPointerMove: ({ event }) => {
				updateMyPresence({ cursor: screenToCanvas({ x: event.clientX, y: event.clientY }, camera) })
			},
		},
		{ target: canvasRef }
	)
}

export default useTrackCursor
