import { motion } from 'framer-motion'
import { FC, memo, PropsWithChildren, useLayoutEffect, useMemo, useRef, useState } from 'react'

const AnimateResize: FC<PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => {
	const measureRef = useRef<HTMLDivElement>(null)
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
		if (!measureRef.current) return
		observer.observe(measureRef.current)

		return () => {
			observer.disconnect()
		}
	})

	return (
		<motion.div animate={{ height }}>
			<div className={className} ref={measureRef}>
				{children}
			</div>
		</motion.div>
	)
}

export default memo(AnimateResize)
