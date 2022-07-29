import { RefObject } from 'react'
import { panCamera } from '@/lib/canvas'
import { useDrag } from '@use-gesture/react'
import { useCamera } from '@/context/CanvasContext'

const usePanGestures = (canvasRef: RefObject<HTMLDivElement>) => {
	const { setCamera } = useCamera()

	useDrag(
		({ event, delta }) => {
			if (event.target != event.currentTarget) return

			setCamera(camera => panCamera(camera, delta[0] * -1, delta[1] * -1))
		},
		{ target: canvasRef }
	)
}

export default usePanGestures
