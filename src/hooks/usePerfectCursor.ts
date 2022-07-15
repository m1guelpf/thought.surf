import { Point } from '@/types/canvas'
import { PerfectCursor } from 'perfect-cursors'
import { useCallback, useLayoutEffect, useState } from 'react'

export function usePerfectCursor(cb: (point: Point) => void, point?: Point) {
	const [pc] = useState(() => new PerfectCursor(point => cb({ x: point[0], y: point[1] })))

	useLayoutEffect(() => {
		if (point) pc.addPoint([point.x, point.y])
		return () => pc.dispose()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pc])

	const onPointChange = useCallback((point: Point) => pc.addPoint([point.x, point.y]), [pc])

	return onPointChange
}
