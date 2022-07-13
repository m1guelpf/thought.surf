import { Box, Camera, Point } from '@/types/canvas'

export const addPoint = (a: Point, b: Point): Point => ({ x: a.x + b.x, y: a.y + b.y })
export const subPoint = (a: Point, b: Point): Point => ({ x: a.x - b.x, y: a.y - b.y })

export const screenToCanvas = (point: Point, camera: Camera): Point => ({
	x: point.x / camera.z - camera.x,
	y: point.y / camera.z - camera.y,
})

export const canvasToScreen = (point: Point, camera: Camera): Point => ({
	x: (point.x + camera.x) * camera.z,
	y: (point.y + camera.y) * camera.z,
})

export const getViewport = (camera: Camera, box: Box): Box => {
	const topLeft = screenToCanvas({ x: box.minX, y: box.minY }, camera)
	const bottomRight = screenToCanvas({ x: box.maxX, y: box.maxY }, camera)

	return {
		minX: topLeft.x,
		minY: topLeft.y,
		maxX: bottomRight.x,
		maxY: bottomRight.y,
		height: bottomRight.x - topLeft.x,
		width: bottomRight.y - topLeft.y,
	}
}

export const getBrowserViewport = (camera: Camera) => {
	return getViewport(camera, {
		minX: 0,
		minY: 0,
		maxX: window.innerWidth,
		maxY: window.innerHeight,
		width: window.innerWidth,
		height: window.innerHeight,
	})
}

export const panCamera = (camera: Camera, dx: number, dy: number): Camera => ({
	x: camera.x - dx / camera.z,
	y: camera.y - dy / camera.z,
	z: camera.z,
})

export const zoomCamera = (camera: Camera, point: Point, dz: number): Camera => {
	const zoom = camera.z - dz * camera.z

	const p1 = screenToCanvas(point, camera)
	const p2 = screenToCanvas(point, { ...camera, z: zoom })

	return {
		x: camera.x + (p2.x - p1.x),
		y: camera.y + (p2.y - p1.y),
		z: zoom,
	}
}
