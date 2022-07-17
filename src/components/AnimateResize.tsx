import { motion } from 'framer-motion'
import useMeasure from '@/hooks/useMeasure'
import { FC, memo, PropsWithChildren } from 'react'

const AnimateResize: FC<PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => {
	const [measureRef, { height }] = useMeasure<HTMLDivElement>()

	return (
		<motion.div animate={{ height }}>
			<div className={className} ref={measureRef}>
				{children}
			</div>
		</motion.div>
	)
}

export default memo(AnimateResize)
