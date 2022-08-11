import { useEffect, useRef } from 'react'

const useSpacebar = () => {
	const pressed = useRef<boolean>(false)

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key == ' ') pressed.current = true
		}

		const onKeyUp = (event: KeyboardEvent) => {
			if (event.key == ' ') pressed.current = false
		}

		document.addEventListener('keyup', onKeyUp)
		document.addEventListener('keydown', onKeyDown)

		return () => {
			document.removeEventListener('keyup', onKeyUp)
			document.removeEventListener('keydown', onKeyDown)
		}
	}, [])

	return pressed
}

export default useSpacebar
