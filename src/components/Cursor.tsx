import { motion } from 'framer-motion'
import { Point } from '@/types/canvas'
import { FC, memo, useMemo } from 'react'
import { canvasToScreen } from '@/lib/canvas'
import { useRefCamera } from '@/store/camera'
import * as Avatar from '@radix-ui/react-avatar'

type Props = { pos: Point; color: string; name?: string; avatar?: string; emoji: string }

const Cursor: FC<Props> = ({ pos, color, name, avatar, emoji }) => {
	const camera = useRefCamera()

	const { x, y } = useMemo(() => {
		return canvasToScreen(pos, camera.current)
	}, [pos, camera])

	return (
		<motion.div
			title={name}
			initial={{ x, y }}
			animate={{ x, y }}
			style={{ backgroundColor: color }}
			className="absolute pointer-events-none top-0 left-0 w-14 h-14 z-20 overflow-hidden border-4 border-white dark:border-gray-900 rounded-full rounded-tl-none flex items-center justify-center"
			transition={{ type: 'spring', damping: 30, mass: 0.8, stiffness: 350 }}
		>
			<Avatar.Root>
				<Avatar.Image src={avatar} alt={name} className="w-full h-full" />
				<Avatar.Fallback>
					<p
						className={`leading-relaxed text-white ${
							name ? 'text-lg' : 'text-2xl'
						} whitespace-nowrap uppercase`}
					>
						{name
							? name
									.split(' ')
									.map(word => word[0])
									.join('')
							: emoji}
					</p>
				</Avatar.Fallback>
			</Avatar.Root>
		</motion.div>
	)
}

export default memo(Cursor)
