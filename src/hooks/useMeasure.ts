import { RefObject, useLayoutEffect, useMemo, useRef, useState } from 'react'

const useMeasure = <T>(): [RefObject<T>, { width: number; height: number }] => {
	const ref = useRef<T>(null)
	const [width, setWidth] = useState<number>(0)
	const [height, setHeight] = useState<number>(0)

	const observer = useMemo(
		() =>
			new (window as any).ResizeObserver(entries => {
				if (entries[0]) {
					const { height, width } = entries[0].contentRect

					setWidth(width)
					setHeight(height)
				}
			}),
		[]
	)

	useLayoutEffect(() => {
		if (!ref.current) return
		observer.observe(ref.current)

		return () => {
			observer.disconnect()
		}
	})

	return [ref, { width, height }]
}

export default useMeasure
