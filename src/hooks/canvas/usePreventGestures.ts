import { useEffect } from 'react'

// Prevents gestures triggering browser actions on iOS
const usePreventGestures = () => {
	useEffect(() => {
		const handler = e => e.preventDefault()

		document.addEventListener('gesturestart', handler)
		document.addEventListener('gesturechange', handler)
		document.addEventListener('gestureend', handler)

		return () => {
			document.removeEventListener('gesturestart', handler)
			document.removeEventListener('gesturechange', handler)
			document.removeEventListener('gestureend', handler)
		}
	}, [])
}

export default usePreventGestures
