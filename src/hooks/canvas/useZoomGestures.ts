import { RefObject } from 'react'
import { useCamera } from '@/context/CanvasContext'
import { panCamera, zoomCamera } from '@/lib/canvas'
import { usePinch, useWheel } from '@use-gesture/react'

const useZoomGestures = (canvasRef: RefObject<HTMLDivElement>) => {
	const { setCamera } = useCamera()

	// handles mouse wheel & trackpad pinch
	useWheel(
		({ event, ctrlKey, metaKey }) => {
			event.preventDefault()

			const { clientX: x, clientY: y, deltaX, deltaY } = event
			const isZoom = ctrlKey || metaKey

			if (isZoom) setCamera(camera => zoomCamera(camera, { x, y }, deltaY / 100))
			else setCamera(camera => panCamera(camera, deltaX, deltaY))
		},
		{ target: canvasRef, eventOptions: { passive: false } }
	)

	// handles touchscreen pinch (doesn't work great yet)
	usePinch(
		({ event, distance: [, deltaY], direction: [direction] }) => {
			if (event.type == 'wheel') return

			const { x, y } = event as PointerEvent
			setCamera(camera => zoomCamera(camera, { x, y }, (deltaY * -direction) / 100))
		},
		{ target: canvasRef, eventOptions: { passive: false } }
	)
}

export default useZoomGestures
