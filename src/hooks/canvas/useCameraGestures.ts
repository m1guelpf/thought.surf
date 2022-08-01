import { RefObject, useCallback } from 'react'
import useStore, { shallow } from '@/lib/store'
import { useGesture } from '@use-gesture/react'
import { eventAlreadyHandled } from '@/lib/canvas'

const getParams = store => ({ panCamera: store.panCamera, zoomCamera: store.zoomCamera })

const useCameraGestures = (canvasRef: RefObject<HTMLDivElement>) => {
	const { panCamera, zoomCamera } = useStore(getParams, shallow)

	const onDrag = useCallback(
		({ event, delta }) => {
			if ((event as PointerEvent)?.pointerType == 'mouse' || eventAlreadyHandled(event)) return

			panCamera(delta[0] * -1, delta[1] * -1)
		},
		[panCamera]
	)

	const onWheel = useCallback(
		({ event, ctrlKey, metaKey }) => {
			event.preventDefault()

			const { clientX: x, clientY: y, deltaX, deltaY } = event
			const isZoom = ctrlKey || metaKey

			if (isZoom) zoomCamera({ x, y }, deltaY / 100)
			else panCamera(deltaX, deltaY)
		},
		[zoomCamera, panCamera]
	)

	const onPinch = useCallback(
		({ event, distance: [, deltaY], direction: [direction, _] }) => {
			if (event.type == 'wheel') return
			event.preventDefault()

			const { x, y } = event as PointerEvent
			zoomCamera({ x, y }, (deltaY * -direction) / 100)
		},
		[zoomCamera]
	)

	useGesture({ onDrag, onWheel, onPinch }, { target: canvasRef, eventOptions: { passive: false } })
}

export default useCameraGestures
