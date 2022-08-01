import { RefObject } from 'react'
import { useGesture } from '@use-gesture/react'
import { useCamera } from '@/context/CanvasContext'
import { eventAlreadyHandled, panCamera, zoomCamera } from '@/lib/canvas'

const useCameraGestures = (canvasRef: RefObject<HTMLDivElement>) => {
	const { setCamera } = useCamera()

	useGesture(
		{
			onDrag: ({ event, delta }) => {
				if ((event as PointerEvent)?.pointerType == 'mouse' || eventAlreadyHandled(event)) return

				setCamera(camera => panCamera(camera, delta[0] * -1, delta[1] * -1))
			},
			onWheel: ({ event, ctrlKey, metaKey }) => {
				event.preventDefault()

				const { clientX: x, clientY: y, deltaX, deltaY } = event
				const isZoom = ctrlKey || metaKey

				if (isZoom) setCamera(camera => zoomCamera(camera, { x, y }, deltaY / 100))
				else setCamera(camera => panCamera(camera, deltaX, deltaY))
			},
			onPinch: ({ event, distance: [, deltaY], direction: [direction] }) => {
				if (event.type == 'wheel') return
				event.preventDefault()

				const { x, y } = event as PointerEvent
				setCamera(camera => zoomCamera(camera, { x, y }, (deltaY * -direction) / 100))
			},
		},
		{ target: canvasRef }
	)
}

export default useCameraGestures
