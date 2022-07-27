import { Box, Camera, Point, Size } from '@/types/canvas'

export const addPoint = (a: Point, b: Point): Point => ({ x: a.x + b.x, y: a.y + b.y })
export const subPoint = (a: Point, b: Point): Point => ({ x: a.x - b.x, y: a.y - b.y })

// Most of the canvas logic comes from Steve Ruiz's "Creating a Zoom UI" article
// https://www.steveruiz.me/posts/zoom-ui

export const screenToCanvas = (point: Point, camera: Camera): Point => ({
	x: point.x / camera.z - camera.x,
	y: point.y / camera.z - camera.y,
})

export const canvasToScreen = (point: Point, camera: Camera): Point => ({
	x: (point.x + camera.x) * camera.z,
	y: (point.y + camera.y) * camera.z,
})

export const isOnScreen = (camera: Camera, point: Point, size: Size): boolean => {
	const { minX, minY, maxX, maxY } = getBrowserViewport(camera)

	return point.x + size.width > minX && point.x < maxX && point.y + size.height > minY && point.y < maxY
}

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

export const zoomCameraTo = (camera: Camera, point: Point, zoom: number): Camera => {
	const p1 = screenToCanvas(point, camera)
	const p2 = screenToCanvas(point, { ...camera, z: zoom })

	return {
		x: camera.x + (p2.x - p1.x),
		y: camera.y + (p2.y - p1.y),
		z: zoom,
	}
}

export const zoomOn = (camera: Camera, point: Point, size: Size): Camera => {
	return {
		x: -point.x + window.innerWidth / 2 - size.width / 2 / camera.z,
		y: -point.y + window.innerHeight / 2 - size.height / 2 / camera.z,
		z: 1,
	}
}

export const zoomIn = (camera: Camera) => {
	const i = Math.round(camera.z * 100) / 50

	const nextZoom = (i + 1) * 0.5
	const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

	return zoomCamera(camera, center, camera.z - nextZoom)
}

export const zoomOut = (camera: Camera) => {
	const i = Math.round(camera.z * 100) / 50

	const nextZoom = (i - 1) * 0.5
	const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

	return zoomCamera(camera, center, camera.z - nextZoom)
}

export const resetZoom = (camera: Camera): Camera => {
	const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

	return zoomCamera(camera, center, camera.z - 1)
}

export const eventAlreadyHandled = (event: MouseEvent | TouchEvent): boolean => {
	const ignoreEl = ['button', 'a', 'input', 'textarea', 'select', 'option']

	return event
		.composedPath()
		.some((item: HTMLElement) => ignoreEl.includes(item.tagName?.toLowerCase()) || item.isContentEditable)
}
