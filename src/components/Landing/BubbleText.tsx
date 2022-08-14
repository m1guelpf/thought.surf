import { classNames } from '@/lib/utils'
import { motion, MotionProps } from 'framer-motion'
import { FC, PropsWithChildren, RefObject, useMemo } from 'react'

type Props = PropsWithChildren<{
	className?: { container?: string; text?: string; shadow?: string }
}>

const BubbleText: FC<Props & MotionProps> = ({ children, className = {}, ...props }) => {
	return (
		<motion.div
			className={classNames(className.container, 'relative inline-flex items-center justify-center z-10')}
			{...props}
		>
			<h1 className={classNames(className.text, 'inline z-[2] relative')}>{children}</h1>
			<span
				className={classNames(
					className.text,
					className.shadow,
					'absolute pointer-events-none inset-0 w-full h-full transform translate-x-1 translate-y-1 !text-transparent bg-clip-text z-[1]'
				)}
			>
				{children}
			</span>
		</motion.div>
	)
}

export const BubbleHeading: FC<{ containerRef: RefObject<HTMLDivElement>; className?: string }> = ({
	containerRef,
	className,
}) => {
	return (
		<BubbleText
			drag
			dragSnapToOrigin
			dragElastic={0.001}
			dragConstraints={containerRef}
			whileDrag={{ cursor: 'grabbing' }}
			className={{
				shadow: 'bg-purple-900/40',
				text: 'text-center text-4xl md:text-7xl font-black text-white',
				container: classNames(className, 'max-w-[300px] md:max-w-6xl mx-auto cursor-grab'),
			}}
		>
			Your ideas are limitless. Break the walls around them.
		</BubbleText>
	)
}

export default BubbleText
