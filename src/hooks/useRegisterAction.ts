import { Action } from '@/types/command-bar'
import { DependencyList, useEffect, useMemo } from 'react'
import useCommandBar, { CommandBarStore, shallow } from '@/store/command-bar'

const getParams = (store: CommandBarStore) => ({
	commands: store.commands,
	addCommands: store.addCommands,
	removeCommands: store.removeCommands,
})

const useRegisterAction = (action: Action | Action[], dependencies: DependencyList = [], include: boolean = true) => {
	const { commands, addCommands, removeCommands } = useCommandBar(getParams, shallow)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const actionsCache = useMemo(() => (Array.isArray(action) ? action : [action]), dependencies)

	const parentsLoaded = useMemo<boolean>(
		() => actionsCache.every(action => (action.parent ? commands.some(a => a.id === action.parent) : true)),
		[actionsCache, commands]
	)

	useEffect(() => {
		if (!parentsLoaded || !include) return

		addCommands(actionsCache)

		return () => {
			removeCommands(actionsCache)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [actionsCache, parentsLoaded, include])
}

export default useRegisterAction
