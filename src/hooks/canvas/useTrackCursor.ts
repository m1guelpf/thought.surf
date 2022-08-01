import { RefObject } from 'react'
import { useRefCamera } from '@/lib/store'
import { screenToCanvas } from '@/lib/canvas'
import { useGesture } from '@use-gesture/react'
import { useUpdateMyPresence } from '@/lib/liveblocks'

const useTrackCursor = (canvasRef: RefObject<HTMLDivElement>) => {
	const camera = useRefCamera()
	const updateMyPresence = useUpdateMyPresence()

	useGesture(
		{
			onPointerMove: ({ event }) => {
				updateMyPresence({ cursor: screenToCanvas({ x: event.clientX, y: event.clientY }, camera.current) })
			},
		},
		{ target: canvasRef }
	)
}

export default useTrackCursor
