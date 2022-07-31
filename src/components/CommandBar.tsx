import commandScore from 'command-score'
import { Dialog } from '@headlessui/react'
import AnimateResize from './AnimateResize'
import { Action } from '@/types/command-bar'
import { FC, useMemo, useState } from 'react'
import { groupAndFlatten } from '@/lib/array'
import useShortcuts from '@/hooks/useShortcuts'
import { classNames, normalizeKey } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRightIcon } from '@heroicons/react/solid'
import { useCommandBar } from '@/context/CommandBarContext'
import useAuthCommands from '@/hooks/command-bar/useAuthCommands'
import useThemeCommands from '@/hooks/command-bar/useThemeCommands'

const resolveName = (action: Action, query: string): string => {
	return typeof action.name === 'string' ? action.name : action.name(query)
}

const getParents = (actions: Array<Action | string>, commands: Action[]): Record<string, Action> => {
	return Object.fromEntries(
		actions
			.filter(action => typeof action !== 'string' && action.parent)
			.map((command: Action) => [command.parent, commands.find(c => c.id === command.parent)])
	)
}

const CommandBar: FC<{}> = () => {
	const [query, setQuery] = useState('')
	const [menu, setMenu] = useState(null)
	const { open, setOpen, commands } = useCommandBar()

	useAuthCommands()
	useThemeCommands()

	const fallbackActions = useMemo<Action[]>(() => {
		return commands.filter(action => action.fallback).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
	}, [commands])

	const filteredActions = useMemo<Array<Action | string>>(() => {
		const results = []

		commands.forEach(command => {
			if (query === '' && !menu && command.parent) return
			if (menu && command.parent !== menu) return

			const parent = commands.find(c => c.id === command.parent)

			const score = commandScore(
				[
					command.name,
					command.keywords?.join(' ') ?? '',
					parent?.name ?? '',
					parent?.keywords?.join(' ') ?? '',
				].join(' '),
				query
			)

			if (score > 0 || query === '') results.push({ command, score })
		})

		return groupAndFlatten(
			'section',
			results
				.sort((a, b) => {
					if (a.command.parent == b.command.id) return 1
					if (b.command.parent == a.command.id) return -1
					if (a.score === b.score) return (b.command.priority ?? 0) - (a.command.priority ?? 0)

					return b.score - a.score
				})
				.map(result => result.command)
		)
	}, [commands, menu, query])

	const parent = useMemo(() => {
		return menu && commands.find(command => command.id === menu)
	}, [commands, menu])

	useShortcuts({
		'$mod+KeyK': event => {
			event.preventDefault()

			setOpen(open => !open)
		},
		...Object.fromEntries(
			commands.map(command => [
				command.shortcut,
				event => {
					if (document.activeElement && document.activeElement !== document.body) return

					executeAction(command)
					event.preventDefault()
				},
			])
		),
	})

	const onLeave = () => {
		setQuery('')
		setMenu(null)
	}

	const executeAction = (action: Action) => {
		setOpen(true)

		if (!action.perform) {
			setQuery('')
			return setMenu(action.id)
		}

		action?.perform(query)
		setMenu(null)
		setOpen(false)
	}

	return (
		<AnimatePresence onExitComplete={onLeave}>
			{open && (
				<Dialog open={open} as="div" className="relative z-40" onClose={setOpen}>
					<Dialog.Overlay
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						as={motion.div}
						className="fixed inset-0 bg-white/50 dark:bg-black/50"
					/>

					<div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-center justify-center">
						<Dialog.Panel
							key="panel"
							as={motion.div}
							exit={{
								opacity: 0,
								scale: 0.75,
								transition: {
									ease: 'easeIn',
									duration: 0.1,
								},
							}}
							initial={{ opacity: 0, scale: 0.75 }}
							animate={{
								opacity: 1,
								scale: 1,
								transition: {
									ease: 'easeOut',
									duration: 0.1,
								},
							}}
							className="flex-1 mx-auto max-w-2xl transform overflow-hidden rounded-xl bg-white/30 dark:bg-gray-900/60 shadow-2xl ring-1 ring-black ring-opacity-5 backdrop-filter backdrop-blur-2xl backdrop-saturate-150"
						>
							<AnimateResize className="divide-y divide-gray-500/10">
								<div className="relative">
									<ChevronRightIcon
										className="pointer-events-none absolute top-3.5 left-3.5 h-5 w-5 text-gray-900 text-opacity-40 dark:text-white/30"
										aria-hidden="true"
									/>
									{menu && (
										<div className="absolute top-0 right-0 flex flex-row gap-x-1 px-4 py-2.5">
											<button
												tabIndex={-1}
												onClick={() => setMenu(null)}
												className="bg-black/5 text-black/60 dark:bg-neutral-800 dark:text-neutral-400/80 px-[.45rem] py-0.5 text-xs rounded-md capitalize"
											>
												{parent.id}
											</button>
										</div>
									)}
									<input
										className="h-12 w-full border-0 bg-transparent pl-11 pr-4 placeholder:text-black/30 dark:text-white/60 dark:placeholder:text-white/50 text-gray-900 placeholder-gray-500 border-b-[1px] border-black/10 dark:bg-black/10 dark:border-white/10 focus:ring-0 focus:outline-0 sm:text-sm"
										placeholder="Type a command or search..."
										value={query}
										onKeyDown={event => {
											if (menu && event.key == 'Escape') {
												event.preventDefault()
												setQuery('')
												return setMenu('')
											}
											if (query == '' && event.key == 'Escape') {
												return setOpen(false)
											}
											if (event.key == 'Escape') {
												event.preventDefault()
												return setQuery('')
											}
											if (menu && query == '' && event.key == 'Backspace') {
												return setMenu('')
											}
										}}
										onChange={event => setQuery(event.target.value)}
									/>
								</div>
								{filteredActions.length != 0 && (
									<ul className="max-h-[700px] scroll-py-2 divide-y divide-gray-500 divide-opacity-10 overflow-y-auto">
										<li className="p-2">
											<OptionRenderer
												actions={filteredActions}
												onClick={action => executeAction(action)}
												parents={getParents(filteredActions, commands)}
												query={query}
												className="text-sm text-gray-700"
											/>
										</li>
									</ul>
								)}
								{query !== '' && filteredActions.length == 0 && (
									<ul className="max-h-[700px] scroll-py-2 divide-gray-500 divide-opacity-10 overflow-y-auto">
										<li className="p-2">
											<p className="mt-2 mb-2 px-3 text-xs font-medium text-gray-700 dark:text-white/30">
												No results for &quot;{query}&quot;.
												{fallbackActions.length > 0 && ' Try one of the actions below:'}
											</p>
											<OptionRenderer
												actions={fallbackActions}
												onClick={action => executeAction(action)}
												parents={getParents(fallbackActions, commands)}
												query={query}
												className="text-sm text-gray-700"
											/>
										</li>
									</ul>
								)}
							</AnimateResize>
						</Dialog.Panel>
					</div>
				</Dialog>
			)}
		</AnimatePresence>
	)
}

const OptionRenderer = ({ actions, className, query, parents, onClick }) => {
	const [selected, setSelected] = useState<number>(0)

	const selectedIndexMap = useMemo<number[]>(() => {
		return actions.map((action, i) => (typeof action == 'string' ? null : i)).filter(Boolean)
	}, [actions])

	useShortcuts({
		ArrowDown: event => {
			event.preventDefault()

			setSelected(selected => {
				if (selected == selectedIndexMap.length - 1) return 0

				return ++selected
			})
		},
		ArrowUp: event => {
			event.preventDefault()

			setSelected(selected => {
				if (selected == 0) return selectedIndexMap.length - 1
				return --selected
			})
		},
		Enter: event => {
			event.preventDefault()

			onClick(actions[selectedIndexMap[selected]])
		},
	})

	return (
		<ul className={className}>
			{actions.map((action, i) =>
				typeof action == 'string' ? (
					<p
						key={i}
						className={classNames(
							actions[0] === action ? '' : 'mt-2',
							'pb-1 pl-3 text-[.65rem] uppercase text-black/50 tracking-wide dark:text-neutral-300/50'
						)}
					>
						{action}
					</p>
				) : (
					<button
						key={i}
						onMouseEnter={() => setSelected(selectedIndexMap.findIndex(id => id == i))}
						onClick={() => onClick(action)}
						className={classNames(
							'flex select-none items-center justify-between rounded-md px-3 py-2 text-black/70 dark:text-white/70 relative w-full'
						)}
					>
						{selectedIndexMap[selected] == i && (
							<motion.div
								layoutId="selected"
								transition={{ duration: 0.2 }}
								className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-lg"
							/>
						)}
						<div className="flex items-center w-full">
							<div
								className={classNames(
									'h-6 w-6 flex-none transition duration-200',
									selectedIndexMap[selected] == i
										? 'text-black/50 dark:text-white/30'
										: 'text-black/20 dark:text-white/20'
								)}
								aria-hidden="true"
							>
								{action.icon}
							</div>
							<div className="flex items-center w-full pr-4 text-left">
								<span className="ml-3 flex-auto truncate">
									{action.parent && (
										<span className="text-black/50 dark:text-white/50">
											<span>{parents[action.parent]?.name}</span>
											<span className="mr-0.5"> &rsaquo; </span>
										</span>
									)}
									<span className="truncate min-w-0">{resolveName(action, query)}</span>
									{action.subtitle && (
										<span className="ml-2 p-0.5 px-1 bg-black/5 text-black/50 dark:bg-white/10 dark:text-white/40 rounded-md text-xs">
											{action.subtitle}
										</span>
									)}
								</span>
							</div>
						</div>
						{action.shortcut && (
							<div aria-hidden className="flex items-center space-x-2">
								{action.shortcut?.split('+').map(sc => (
									<kbd
										key={sc}
										className="py-px px-2 bg-black/5 text-black/50 dark:bg-white/10 dark:text-white/40 rounded-md text-sm flex items-center justify-center"
									>
										{normalizeKey(sc)}
									</kbd>
								))}
							</div>
						)}
					</button>
				)
			)}
		</ul>
	)
}

export default CommandBar
