import { APP_NAME } from '@/lib/consts'
import { classNames } from '@/lib/utils'
import { useKBar } from 'kbar'
import { useEffect, useRef, useState } from 'react'
import CommandIcon from './Icons/CommandIcon'

const Header = () => {
	const { query } = useKBar()
	const headerRef = useRef<HTMLDivElement>(null)
	const [isVisible, setVisible] = useState<boolean>(false)

	useEffect(() => {
		const onMouseMove = (event: MouseEvent) => setVisible(event.clientY < 200)

		document.addEventListener('mousemove', onMouseMove)

		return () => {
			document.removeEventListener('mousemove', onMouseMove)
		}
	})

	return (
		<header
			ref={headerRef}
			className={classNames(
				!isVisible && 'opacity-0',
				`fixed inset-x-8 top-8 flex items-center justify-between z-20 transition-opacity ease-in duration-300`
			)}
		>
			<div></div>
			<div className="bg-gray-200/40 dark:bg-black/40 backdrop-filter backdrop-blur backdrop-saturate-150 p-2 border dark:border-white/20 rounded-lg">
				<p className="text-gray-700 dark:text-gray-300">{APP_NAME}</p>
			</div>
			<button
				onClick={() => query.toggle()}
				className="bg-white dark:bg-black/70 border border-transparent dark:border-white/20 p-3 rounded-lg shadow dark:shadow-none"
			>
				<CommandIcon className="w-4 h-4 dark:text-gray-400" />
			</button>
		</header>
	)
}

export default Header
