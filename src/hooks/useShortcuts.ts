import { useEffect } from 'react'
import tinykeys, { KeyBindingMap, KeyBindingOptions } from 'tinykeys'

const useShortcuts = (shortcuts: KeyBindingMap, options?: KeyBindingOptions) => {
	useEffect(() => {
		const unsubscribe = tinykeys(window, shortcuts, options)

		return () => unsubscribe()
	})
}

export default useShortcuts
