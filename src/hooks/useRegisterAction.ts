import { Action, useKBar } from 'kbar'
import { DependencyList, useEffect, useMemo } from 'react'

const useRegisterAction = (action: Action | Action[], dependencies: DependencyList = [], include: boolean = true) => {
	const { query, actionTree } = useKBar(state => {
		return { actionTree: state.actions }
	})

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const actionsCache = useMemo(() => (Array.isArray(action) ? action : [action]), dependencies)

	const parentsLoaded = useMemo<boolean>(
		() => actionsCache.every(action => (action.parent ? actionTree[action.parent] : true)),
		[actionsCache, actionTree]
	)

	useEffect(() => {
		if (!parentsLoaded || !include) return

		const unregister = query.registerActions(actionsCache)

		return () => unregister()
	}, [query, actionsCache, parentsLoaded, include])
}

export default useRegisterAction
