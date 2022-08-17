import { classNames } from '@/lib/utils'
import useDebugLog from '@/hooks/useDebugLog'
import { motion, Point, useMotionValue } from 'framer-motion'
import { FC, memo, PropsWithChildren, RefObject, useEffect, useLayoutEffect, useMemo } from 'react'

type Props = PropsWithChildren<{
	title: string
	initialPos: Point
	className?: string
	icon?: FC<{ className?: string }>
	containerRef: RefObject<HTMLDivElement>
}>

const SCALE_CONST = 10000

const FileCard: FC<Props> = ({ containerRef, title, icon: Icon, children, className, initialPos }) => {
	const x = useMotionValue(0)
	const y = useMotionValue(0)
	const scale = useMotionValue(0)

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		x.set((initialPos.x / SCALE_CONST) * container.offsetWidth)
		y.set((initialPos.y / SCALE_CONST) * container.offsetHeight)
		scale.set(1)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialPos, containerRef])

	useDebugLog(
		() => ({
			x: (x.get() / containerRef.current.offsetWidth) * SCALE_CONST,
			y: (y.get() / containerRef.current.offsetHeight) * SCALE_CONST,
		}),
		title,
		[x, y, containerRef]
	)

	return (
		<motion.div
			drag
			dragElastic={false}
			dragMomentum={false}
			style={{ x, y, scale }}
			whileDrag={{ cursor: 'grabbing' }}
			className="absolute top-0 left-0 bg-white dark:bg-gray-900 rounded-3xl overflow-hidden z-20 md:min-w-[300px] md:min-h-[150px] shadow-card mx-2 md:mx-0"
		>
			<div className="bg-gray-100 dark:bg-gray-700 py-3 flex items-center justify-center space-x-1">
				{Icon && <Icon className="w-5 h-5" />}
				<p className="text-gray-600 dark:text-gray-400 font-medium">{title}</p>
			</div>
			<div className={classNames(className)}>{children}</div>
		</motion.div>
	)
}

export default memo(FileCard)
