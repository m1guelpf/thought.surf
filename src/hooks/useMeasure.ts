import { RefObject, useLayoutEffect, useMemo, useRef, useState } from 'react'

const useMeasure = <T>(): [RefObject<T>, { height: number }] => {
	const ref = useRef<T>(null)
	const [height, setHeight] = useState<number>(0)

	const observer = useMemo(
		() =>
			new (window as any).ResizeObserver(entries => {
				if (entries[0]) {
					const { height } = entries[0].contentRect
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

	return [ref, { height }]
}

export default useMeasure
