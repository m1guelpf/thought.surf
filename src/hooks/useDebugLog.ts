/* eslint-disable react-hooks/rules-of-hooks */
import useShortcuts from './useShortcuts'
import { DependencyList, useCallback } from 'react'

const useDebugLog = (
	items: Record<string, unknown> | (() => Record<string, unknown>),
	location: string,
	deps: DependencyList
): void => {
	if (process.env.NODE_ENV === 'production') return

	const onDebug = useCallback(event => {
		event.preventDefault()

		console.log(`[${location}]:`, items instanceof Function ? items() : items)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps)

	useShortcuts({ '$mod+KeyD': onDebug })
}

export default useDebugLog
