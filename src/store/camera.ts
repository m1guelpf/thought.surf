import create from 'zustand'
import shallow from 'zustand/shallow'
import { RefObject, useEffect, useRef } from 'react'
import { Camera, Point, Size } from '@/types/canvas'
import { subscribeWithSelector, persist } from 'zustand/middleware'
import { panCamera, zoomCamera, zoomIn, zoomOn, zoomOut } from '../lib/canvas'

export type CameraStore = {
	camera: Camera
	showGrid: boolean
	toggleGrid: () => void
	resetCamera: () => void
	isTransitioning: boolean
	zoomCameraIn: () => void
	zoomCameraOut: () => void
	panCamera: (dx: number, dy: number) => void
	zoomCamera: (point: Point, dz: number) => void
	zoomOnPoint: (point: Point, size: Size) => void
	setTransitioning: (isTransitioning: boolean) => void
}

const useCamera = create<CameraStore>()(
	subscribeWithSelector(
		persist(
			set => ({
				showGrid: false,
				isTransitioning: false,
				camera: { x: 1, y: 1, z: 1 },
				resetCamera: () => set({ camera: { x: 1, y: 1, z: 1 } }),
				setTransitioning: isTransitioning => set({ isTransitioning }),
				toggleGrid: () => set(store => ({ showGrid: !store.showGrid })),
				zoomCameraIn: () => set(store => ({ camera: zoomIn(store.camera) })),
				zoomCameraOut: () => set(store => ({ camera: zoomOut(store.camera) })),
				panCamera: (dx, dy) => set(store => ({ camera: panCamera(store.camera, dx, dy) })),
				zoomCamera: (point, dz) => set(store => ({ camera: zoomCamera(store.camera, point, dz) })),
				zoomOnPoint: (point, size) => set(store => ({ camera: zoomOn(store.camera, point, size) })),
			}),
			{ name: 'camera', partialize: state => ({ camera: state.camera }) }
		)
	)
)

export const useRefCamera = (): RefObject<Camera> => {
	const cameraRef = useRef<Camera>(useCamera.getState().camera)

	useEffect(
		() =>
			useCamera.subscribe(
				store => store.camera,
				camera => (cameraRef.current = camera),
				{ equalityFn: shallow }
			),
		[]
	)

	return cameraRef
}

export { shallow }
export default useCamera
