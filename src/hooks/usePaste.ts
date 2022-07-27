import { DependencyList, useCallback, useEffect } from 'react'

const usePaste = (cb: (event: ClipboardEvent) => void, deps: DependencyList = []) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const memoizedCb = useCallback(cb, deps)

	useEffect(() => {
		document.addEventListener('paste', memoizedCb)

		return () => {
			document.removeEventListener('paste', memoizedCb)
		}
	})
}

export default usePaste
