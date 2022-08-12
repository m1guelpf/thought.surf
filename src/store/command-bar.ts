import create from 'zustand'
import shallow from 'zustand/shallow'
import commandScore from 'command-score'
import { Action } from '@/types/command-bar'
import { RefObject, useEffect, useRef } from 'react'
import { subscribeWithSelector } from 'zustand/middleware'

export type CommandBarStore = {
	open: boolean
	menu: string
	query: string
	commands: Action[]
	setMenu: (menu: string) => void
	setOpen: (open: boolean) => void
	setQuery: (query: string) => void
	addCommands: (commands: Action[]) => void
	removeCommands: (commands: Action[]) => void
	computed: {
		readonly filteredCommands: Action[]
		readonly parents: Record<string, Action>
	}
}

const useCommandBar = create<CommandBarStore>()(
	subscribeWithSelector((set, get) => ({
		query: '',
		menu: '',
		open: false,
		commands: [],
		setOpen: open => set({ open }),
		setMenu: menu => set({ menu }),
		setQuery: query => set({ query }),
		addCommands: (commands: Action[]) => {
			set(state => ({ commands: state.commands.concat(commands).map(hasParent) }))
		},
		removeCommands: (commands: Action[]) => {
			set(state => ({
				commands: state.commands.filter(command => !commands.some(a => a.id === command.id)).map(hasParent),
			}))
		},
		computed: {
			get filteredCommands() {
				const results = []

				get().commands.forEach(command => {
					if (get().query === '' && !get().menu && command.parent) return
					if (get().menu && command.parent !== get().menu) return

					const parent = get().commands.find(c => c.id === command.parent)

					const score = commandScore(
						[
							command.name,
							command.keywords?.join(' ') ?? '',
							parent?.name ?? '',
							parent?.keywords?.join(' ') ?? '',
						].join(' '),
						get().query
					)

					if (score > 0 || get().query === '') results.push({ command, score })
				})

				return results
					.sort((a, b) => {
						if (a.command.parent == b.command.id) return 1
						if (b.command.parent == a.command.id) return -1
						if (a.score === b.score) return (b.command.priority ?? 0) - (a.command.priority ?? 0)

						return b.score - a.score
					})
					.map(result => result.command)
			},
			get parents() {
				return Object.fromEntries(
					get()
						.computed.filteredCommands.filter(command => command.parent)
						.map(command => [command.parent, get().commands.find(c => c.id === command.parent)])
				)
			},
		},
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
