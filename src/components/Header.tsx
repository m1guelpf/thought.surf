import { classNames } from '@/lib/utils'
import ConnectWallet from './ConnectWallet'
import CommandIcon from './Icons/CommandIcon'
import { FC, memo, useEffect, useRef, useState } from 'react'
import useCommandBar, { CommandBarStore, useRefOpen } from '@/store/command-bar'

const getSetOpen = (store: CommandBarStore) => store.setOpen

const Header: FC<{ roomId: string }> = ({ roomId }) => {
	const open = useRefOpen()
	const setOpen = useCommandBar(getSetOpen)

	const headerRef = useRef<HTMLDivElement>(null)
	const [isVisible, setVisible] = useState<boolean>(false)

	useEffect(() => {
		const onMouseMove = (event: MouseEvent) => {
			if (open.current) return

			setVisible(event.clientY < 200)
		}

		document.addEventListener('mousemove', onMouseMove)

		return () => {
			document.removeEventListener('mousemove', onMouseMove)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<header
			ref={headerRef}
			className={classNames(
				!isVisible && 'opacity-0',
				`fixed inset-x-8 top-8 flex items-center justify-between z-20 transition-opacity ease-in duration-300`
			)}
		>
			<button
				onClick={() => setOpen(true)}
				className="bg-white dark:bg-black/70 border border-transparent dark:border-white/20 p-3 rounded-lg shadow dark:shadow-none"
			>
				<CommandIcon className="w-4 h-4 dark:text-gray-400" />
			</button>
			<div className="bg-gray-200/40 dark:bg-black/40 backdrop-filter backdrop-blur backdrop-saturate-150 p-2 border dark:border-white/20 rounded-lg">
				<p className="text-gray-700 dark:text-gray-300">{roomId}</p>
			</div>
			<ConnectWallet />
		</header>
	)
}

export default memo(Header)
