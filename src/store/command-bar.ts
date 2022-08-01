import create from 'zustand'
import shallow from 'zustand/shallow'
import { Action } from '@/types/command-bar'
import { RefObject, useEffect, useRef } from 'react'
import { subscribeWithSelector } from 'zustand/middleware'

export type CommandBarStore = {
	open: boolean
	commands: Action[]
	setOpen: (open: boolean) => void
	addCommands: (commands: Action[]) => void
	removeCommands: (commands: Action[]) => void
}

const useCommandBar = create<CommandBarStore>()(
	subscribeWithSelector(set => ({
		open: false,
		commands: [],
		setOpen: open => set({ open }),
		addCommands: (commands: Action[]) =>
			set(state => ({ commands: state.commands.concat(commands).map(hasParent) })),
		removeCommands: (commands: Action[]) =>
			set(state => ({
				commands: state.commands.filter(command => !commands.some(a => a.id === command.id)).map(hasParent),
			})),
	}))
)

const hasParent = (command, _, commands) => {
	command.hasChildren = commands.some(a => a.parent === command.id)

	return command
}

export const useRefOpen = (): RefObject<boolean> => {
	const openRef = useRef<boolean>(useCommandBar.getState().open)

	useEffect(
		() =>
			useCommandBar.subscribe(
				store => store.open,
				open => (openRef.current = open),
				{ equalityFn: shallow }
			),
		[]
	)

	return openRef
}

export const useRefCommands = (): RefObject<Action[]> => {
	const commandsRef = useRef<Action[]>(useCommandBar.getState().commands)

	useEffect(
		() =>
			useCommandBar.subscribe(
				store => store.commands,
				commands => (commandsRef.current = commands),
				{ equalityFn: shallow }
			),
		[]
	)

	return commandsRef
}

export { shallow }
export default useCommandBar
