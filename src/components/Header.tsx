import { useGesture } from '@use-gesture/react'
import { useEffect, useRef, useState } from 'react'

const Header = () => {
	const headerRef = useRef<HTMLDivElement>(null)
	const [isVisible, setVisible] = useState<boolean>(false)

	useEffect(() => {
		const onMouseMove = (event: MouseEvent) => {
			if (event.clientY < 200) headerRef.current.style.setProperty('opacity', '1')
			else headerRef.current.style.setProperty('opacity', '0')
		}

		document.addEventListener('mousemove', onMouseMove)

		return () => {
			document.removeEventListener('mousemove', onMouseMove)
		}
	})

	return (
		<header
			ref={headerRef}
			className="fixed inset-x-8 top-8 flex items-center justify-center z-20 transition-opacity ease-in duration-300"
		>
			<div className="bg-gray-800/40 backdrop-filter backdrop-blur backdrop-saturate-150 p-2 border border-gray-700 rounded-lg">
				<p className="text-gray-300">canvas experiment</p>
			</div>
		</header>
	)
}

export default Header
