import { Action } from '@/types/command-bar'
import { DependencyList, useEffect, useMemo } from 'react'
import { useCommandBar } from '@/context/CommandBarContext'

const useRegisterAction = (action: Action | Action[], dependencies: DependencyList = [], include: boolean = true) => {
	const { commands, setCommands } = useCommandBar()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const actionsCache = useMemo(() => (Array.isArray(action) ? action : [action]), dependencies)

	const parentsLoaded = useMemo<boolean>(
		() => actionsCache.every(action => (action.parent ? commands.some(a => a.id === action.parent) : true)),
		[actionsCache, commands]
	)

	useEffect(() => {
		if (!parentsLoaded || !include) return

		setCommands(commands => commands.concat(actionsCache).map(hasParent))

		return () => {
			setCommands(commands =>
				commands.filter(command => !actionsCache.some(a => a.id === command.id)).map(hasParent)
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [actionsCache, parentsLoaded, include])
}

const hasParent = (command, _, commands) => {
	command.hasChildren = commands.some(a => a.parent === command.id)

	return command
}

export default useRegisterAction
