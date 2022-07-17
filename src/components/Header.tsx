import { classNames } from '@/lib/utils'
import { useRoom } from '@/lib/liveblocks'
import CommandIcon from './Icons/CommandIcon'
import { memo, useEffect, useRef, useState } from 'react'
import { useCommandBar } from '@/context/CommandBarContext'

const Header = () => {
	const room = useRoom()
	const { open, setOpen } = useCommandBar()

	const headerRef = useRef<HTMLDivElement>(null)
	const [isVisible, setVisible] = useState<boolean>(false)

	useEffect(() => {
		const onMouseMove = (event: MouseEvent) => {
			if (open) return

			setVisible(event.clientY < 200)
		}

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
				<p className="text-gray-700 dark:text-gray-300">{room.id}</p>
			</div>
			<button
				onClick={() => setOpen(true)}
				className="bg-white dark:bg-black/70 border border-transparent dark:border-white/20 p-3 rounded-lg shadow dark:shadow-none"
			>
				<CommandIcon className="w-4 h-4 dark:text-gray-400" />
			</button>
		</header>
	)
}

export default memo(Header)
