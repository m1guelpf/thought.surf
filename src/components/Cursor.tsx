import { motion } from 'framer-motion'
import { Point } from '@/types/canvas'
import { FC, memo, useMemo } from 'react'
import { canvasToScreen } from '@/lib/canvas'
import { useRefCamera } from '@/store/camera'

const Cursor: FC<{ pos: Point; color: string; name?: string }> = ({ pos, color, name }) => {
	const camera = useRefCamera()

	const { x, y } = useMemo(() => {
		return canvasToScreen(pos, camera.current)
	}, [pos, camera])

	return (
		<motion.div
			initial={{ x, y }}
			animate={{ x, y }}
			className="absolute pointer-events-none top-0 left-0 z-20"
			transition={{ type: 'spring', damping: 30, mass: 0.8, stiffness: 350 }}
		>
			<svg
				className="w-9 h-9"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 35 35"
				fill="currentColor"
				fillRule="evenodd"
			>
				<g className="text-black/20" transform="translate(1,1)">
					<path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
					<path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
				</g>
				<g className="text-white">
					<path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
					<path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
				</g>
				<g fill={color}>
					<path d="m19.751 24.4155-1.844.774-3.1-7.374 1.841-.775z" />
					<path d="m13 10.814v11.188l2.969-2.866.428-.139h4.768z" />
				</g>
			</svg>
			{name && (
				<motion.div
					layout
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					className="absolute top-8 left-4 px-2 py-1 rounded-xl"
					style={{ backgroundColor: color }}
				>
					<p className="leading-relaxed text-white whitespace-nowrap text-xs">{name}</p>
				</motion.div>
			)}
		</motion.div>
	)
}

export default memo(Cursor)
