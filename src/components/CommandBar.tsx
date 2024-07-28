import { Command } from 'cmdk'
import { groupBy } from '@/lib/array'
import AnimateResize from './AnimateResize'
import { Action } from '@/types/command-bar'
import useShortcuts from '@/hooks/useShortcuts'
import { classNames, normalizeKey } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import useAuthCommands from '@/hooks/command-bar/useAuthCommands'
import useThemeCommands from '@/hooks/command-bar/useThemeCommands'
import useCommandBar, { CommandBarStore } from '@/store/command-bar'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { FC, PropsWithChildren, useCallback, useEffect, useMemo, useRef } from 'react'

const getParams = (store: CommandBarStore) => ({
	menu: store.menu,
	open: store.open,
	query: store.query,
	setMenu: store.setMenu,
	setOpen: store.setOpen,
	setQuery: store.setQuery,
	commands: store.commands,
	parents: store.computed.parents,
	filteredCommands: store.computed.filteredCommands,
})

const CommandBar: FC<{}> = () => {
	const inputRef = useRef<HTMLInputElement>(null)
	const { menu, query, setMenu, setQuery, open, setOpen, commands, filteredCommands, parents } =
		useCommandBar(getParams)

	useAuthCommands()
	useThemeCommands()

	const groupedActions = useMemo<Array<[string, Action[]]>>(() => {
		return Object.entries(groupBy('section', filteredCommands))
	}, [filteredCommands])

	const parent = useMemo(() => menu && parents[menu], [parents, menu])

	useEffect(() => {
		if (!open) return

		inputRef.current?.focus()
	}, [open])

	useShortcuts({
		'$mod+KeyK': event => {
			event.preventDefault()

			setOpen(!open)
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

	const onClosed = useCallback(() => {
		setQuery('')
		setMenu(null)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const executeAction = useCallback((action: Action) => {
		setOpen(true)

		if (!action.perform) {
			setQuery('')
			return setMenu(action.id)
		}

		action?.perform()
		setOpen(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const closeMenu = useCallback(() => setMenu(null), [])

	const onKeyDown = useCallback(
		event => {
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
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[menu, query]
	)

	return (
		<AnimatePresence onExitComplete={onClosed}>
			{open && (
				<Dialog open={open} as="div" className="relative z-40" onClose={setOpen}>
					<DialogBackdrop
						as={motion.div}
						exit={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="fixed inset-0 bg-white/50 dark:bg-black/50"
					/>

					<Command
						shouldFilter={false}
						className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-center justify-center"
					>
						<DialogPanel
							key="panel"
							as={motion.div}
							initial={{ opacity: 0, scale: 0.75 }}
							exit={{ opacity: 0, scale: 0.75, transition: { ease: 'easeIn', duration: 0.1 } }}
							animate={{ opacity: 1, scale: 1, transition: { ease: 'easeOut', duration: 0.1 } }}
							className="flex-1 mx-auto max-w-2xl transform overflow-hidden rounded-xl bg-white/30 dark:bg-gray-900/60 shadow-2xl ring-1 ring-black ring-opacity-5 backdrop-filter backdrop-blur-2xl backdrop-saturate-150"
						>
							<AnimateResize className="divide-y divide-gray-500/10">
								<div className="relative">
									<ChevronRightIcon
										className="pointer-events-none absolute top-3.5 left-3 h-5 w-auto text-gray-900/30 dark:text-white/30"
										aria-hidden="true"
									/>
									{menu && (
										<div className="absolute top-0 right-0 flex flex-row gap-x-1 px-4 py-2.5">
											<button
												tabIndex={-1}
												onClick={closeMenu}
												className="bg-black/5 text-black/60 dark:bg-neutral-800 dark:text-neutral-400/80 px-[.45rem] py-0.5 text-xs rounded-md capitalize"
											>
												{parent.id}
											</button>
										</div>
									)}
									<Command.Input
										autoFocus
										value={query}
										ref={inputRef}
										onKeyDown={onKeyDown}
										onValueChange={setQuery}
										placeholder="Type a command or search..."
										className="h-12 w-full border-0 bg-transparent pl-11 pr-4 placeholder:text-black/30 dark:text-white/60 dark:placeholder:text-white/50 text-gray-900 placeholder-gray-500 border-b-[1px] border-black/10 dark:bg-black/10 dark:border-white/10 focus:ring-0 focus:border-black/10 focus:outline-0 sm:text-sm"
									/>
								</div>
								{filteredCommands.length == 0 ? (
									<ul className="overflow-y-auto">
										<Command.Empty className="py-2 mt-2 mb-2 px-3 text-xs font-medium text-gray-700 dark:text-white/30">
											No results for &quot;{query}&quot;.
										</Command.Empty>
									</ul>
								) : (
									<ul className="max-h-[700px] scroll-py-2 divide-y divide-gray-500 divide-opacity-10 overflow-y-auto">
										<li className="p-2">
											<OptionRenderer
												query={query}
												parents={parents}
												onClick={executeAction}
												actions={groupedActions}
												className="text-sm text-gray-700"
											/>
										</li>
									</ul>
								)}
							</AnimateResize>
						</DialogPanel>
					</Command>
				</Dialog>
			)}
		</AnimatePresence>
	)
}

type OptionRendererProps = {
	query: string
	className: string
	parents: Record<string, Action>
	onClick: (action: Action) => void
	actions: Array<[string, Action[]]>
}

const OptionRenderer: FC<OptionRendererProps> = ({ actions, className, query, parents, onClick }) => (
	<Command.List className={className}>
		{actions.map(([name, actions], i) => (
			<CommandGroup key={name} name={name} isFirst={i === 0}>
				{actions.map(action => (
					<Command.Item
						key={action.id}
						value={action.id}
						onSelect={() => onClick(action)}
						className={classNames(
							'flex select-none items-center justify-between rounded-md px-3 py-2 text-black/70 dark:text-white/70 selected:bg-black/5 selected:dark:bg-white/10 relative w-full'
						)}
					>
						<div className="flex items-center w-full">
							<div
								className="h-6 w-6 flex-none transition duration-200 text-black/20 selected:text-black/50 dark:text-white/20 selected:dark:text-white/30"
								aria-hidden="true"
							>
								{action.icon}
							</div>
							<div className="flex items-center w-full pr-4 text-left">
								<span className="ml-3 flex-auto truncate">
									{action.parent && (
										<span className="text-black/50 dark:text-white/50">
											<span>{parents[action.parent].name}</span>
											<span className="mr-0.5"> &rsaquo; </span>
										</span>
									)}
									<span className="truncate min-w-0">{action.name}</span>
									{action.subtitle && (
										<span className="ml-2 p-0.5 px-1 bg-black/5 text-black/50 dark:bg-white/10 dark:text-white/40 rounded-md text-xs">
											{action.subtitle}
										</span>
									)}
								</span>
							</div>
						</div>
						{action.shortcut && (
							<div aria-hidden className="flex items-center space-x-1">
								{action.shortcut.split('+').map(sc => (
									<kbd
										key={sc}
										className="py-px px-2 bg-black/5 text-black/50 dark:bg-white/10 dark:text-white/40 rounded-md text-sm flex items-center justify-center"
									>
										{normalizeKey(sc)}
									</kbd>
								))}
							</div>
						)}
					</Command.Item>
				))}
			</CommandGroup>
		))}
	</Command.List>
)

type CommandGroupTypes = PropsWithChildren<{ name: string; skip?: boolean; isFirst: boolean }>

const CommandGroup: FC<CommandGroupTypes> = ({ name, children, skip, isFirst }) => {
	if (!name) return <>{children}</>

	return (
		<Command.Group
			heading={
				<p
					className={classNames(
						!isFirst && 'mt-2',
						'pb-1 pl-3 text-[.65rem] uppercase text-black/50 tracking-wide dark:text-neutral-300/50'
					)}
				>
					{name}
				</p>
			}
			key={name}
		>
			{children}
		</Command.Group>
	)
}

export default CommandBar
