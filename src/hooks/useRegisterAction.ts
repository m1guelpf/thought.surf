import { Action, useKBar } from 'kbar'
import { useEffect, useMemo } from 'react'

const useRegisterAction = (action: Action, dependencies: React.DependencyList = []) => {
	const { query, actionTree } = useKBar(state => {
		return { actionTree: state.actions }
	})

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const actionCache = useMemo(() => action, dependencies)

	const parentsLoaded = useMemo<boolean>(
		() => (actionCache.parent ? !!actionTree[actionCache.parent] : true),
		[actionCache, actionTree]
	)

	useEffect(() => {
		if (!parentsLoaded) return

		const unregister = query.registerActions([actionCache])

		return () => unregister()
	}, [query, actionCache, parentsLoaded])
}

export default useRegisterAction
