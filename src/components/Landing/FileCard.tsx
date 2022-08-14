import { classNames } from '@/lib/utils'
import { motion, Point } from 'framer-motion'
import { FC, PropsWithChildren, RefObject } from 'react'

type Props = PropsWithChildren<{
	title: string
	initialPos: Point
	className?: string
	icon?: FC<{ className?: string }>
	containerRef: RefObject<HTMLDivElement>
}>

const FileCard: FC<Props> = ({ containerRef, title, icon: Icon, children, className, initialPos }) => {
	return (
		<motion.div
			drag
			dragElastic={false}
			initial={initialPos}
			dragMomentum={false}
			className="absolute top-0 left-0 bg-white rounded-3xl overflow-hidden z-20 md:min-w-[300px] md:min-h-[150px] shadow-card mx-2 md:mx-0"
		>
			<div className="bg-gray-100 py-3 flex items-center justify-center space-x-1">
				{Icon && <Icon className="w-5 h-5" />}
				<p className="text-gray-600 font-medium">{title}</p>
			</div>
			<div className={classNames(className)}>{children}</div>
		</motion.div>
	)
}

export default FileCard
