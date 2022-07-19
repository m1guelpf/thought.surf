import { FC } from 'react'
import LoadingIcon from './Icons/LoadingIcon'
import { AnimatePresence, motion } from 'framer-motion'

const LoadingScreen: FC<{ loading: boolean }> = ({ loading }) => {
	return (
		<AnimatePresence>
			{loading && (
				<motion.div
					exit={{ opacity: 0 }}
					className={`absolute w-screen h-screen inset-0 flex flex-col items-center justify-center cursor-wait z-50 bg-white/10 backdrop-filter backdrop-blur saturate-150`}
				>
					<LoadingIcon className="w-32 h-32" animated />
					<p className="-mt-6 ml-3 select-none text-2xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-br from-purple-300 to-purple-700">
						Loading...
					</p>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default LoadingScreen
