import toast from 'react-hot-toast'
import copy from 'copy-to-clipboard'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { Sections } from '@/types/command-bar'
import { classNames, normalizeKey } from '@/lib/utils'
import { FC, forwardRef, PropsWithChildren, PropsWithRef, Ref, useMemo } from 'react'
import {
	MoonIcon,
	SunIcon,
	DesktopComputerIcon,
	LightningBoltIcon,
	LinkIcon,
	CameraIcon,
	ZoomInIcon,
} from '@heroicons/react/outline'
import {
	Action,
	ActionId,
	ActionImpl,
	KBarAnimator,
	KBarPortal,
	KBarPositioner,
	KBarProvider,
	KBarQuery,
	KBarResults,
	KBarSearch,
	NO_GROUP,
	Priority,
	useKBar,
	useMatches,
} from 'kbar'

const CommandBar: FC<PropsWithChildren<{}>> = ({ children }) => {
	const router = useRouter()
	const { setTheme } = useTheme()

	const actions: Action[] = [
		{
			id: 'wallet-login',
			name: 'Sign In with Wallet',
			icon: <LightningBoltIcon />,
			section: Sections.Account,
			priority: Priority.HIGH,
			keywords: 'account save ethereum wallet login sign-in',
			perform: () => toast.error('Not implemented yet'),
		},
		{
			id: 'center-camera',
			name: 'Center Camera',
			icon: <CameraIcon />,
			section: Sections.Canvas,
			keywords: 'reset',
			perform: () => toast.error('Not implemented yet'),
		},
		{
			id: 'zoom-in',
			name: 'Zoom In',
			icon: <ZoomInIcon />,
			section: Sections.Canvas,
			shortcut: ['Meta+Equal'],
			keywords: 'bigger',
			perform: () => toast.error('Not implemented yet'),
		},
		{
			id: 'zoom-out',
			name: 'Zoom Out',
			icon: <ZoomInIcon />,
			section: Sections.Canvas,
			shortcut: ['Meta+Minus'],
			keywords: 'smaller',
			perform: () => toast.error('Not implemented yet'),
		},
		{
			id: 'theme',
			name: 'Toggle theme',
			shortcut: ['t'],
			priority: Priority.LOW,
			icon: <DesktopComputerIcon />,
			section: Sections.General,
		},
		{
			id: 'link',
			name: 'Copy URL',
			icon: <LinkIcon />,
			keywords: 'share',
			priority: Priority.LOW,
			section: Sections.General,
			perform: () => {
				copy(`${window.location.origin}${router.asPath}`)
				toast.success('Copied to clipboard!')
			},
		},
		{
			id: 'light',
			name: 'Light',
			icon: <SunIcon />,
			section: Sections.General,
			keywords: 'light theme',
			parent: 'theme',
			perform: () => setTheme('light'),
		},
		{
			id: 'dark',
			name: 'Dark',
			icon: <MoonIcon />,
			section: Sections.General,
			keywords: 'dark theme',
			parent: 'theme',
			perform: () => setTheme('dark'),
		},
		{
			id: 'system',
			name: 'System',
			icon: <DesktopComputerIcon />,
			section: Sections.General,
			keywords: 'system theme',
			parent: 'theme',
			perform: () => setTheme('system'),
		},
	]

	return (
		<KBarProvider actions={actions} options={{ enableHistory: true }}>
			<KBarPortal>
				<KBarPositioner className="bg-white/50 dark:bg-black/50 pt-[10vh] px-4 pb-4 z-40">
					<KBarAnimator className="overflow-hidden w-full max-w-2xl bg-white/10 rounded-lg shadow-2xl backdrop-filter backdrop-blur-2xl backdrop-saturate-150 border border-black/10 z-10">
						<div>
							<Breadcrumbs />
							<KBarSearch
								defaultPlaceholder="What do you need?"
								className="placeholder:text-black/30 dark:text-white/60 dark:placeholder:text-white/50 pt-4 pb-3.5 px-4 mb-2 w-full border-b-[1px] border-black/10 box-border outline-none dark:bg-black/10 dark:border-white/10"
							/>
						</div>
						<div>
							<Results />
						</div>
					</KBarAnimator>
				</KBarPositioner>
			</KBarPortal>
			{children}
		</KBarProvider>
	)
}

const Breadcrumbs: FC = () => {
	const { query } = useKBar()
	const { results, rootActionId } = useMatches()
	const filtered = results.filter(r => typeof r !== 'string')

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const action = useMemo(() => filtered[0] as ActionImpl, [rootActionId])

	return (
		<ul className="absolute top-0 right-0 flex flex-row gap-x-1 px-4 py-2.5">
			{action?.ancestors?.map((el, idx) => (
				<Breadcrumb key={idx} text={el.id} query={query} />
			))}
		</ul>
	)
}

const Breadcrumb: FC<{ text: string; query: KBarQuery }> = ({ text, query }) => {
	return (
		<button
			className="bg-black/5 text-black/60 dark:bg-neutral-800 dark:text-neutral-400/80 px-[.45rem] py-0.5 text-xs rounded-md capitalize"
			onClick={() => query.setCurrentRootAction('')}
		>
			{text}
		</button>
	)
}

const Results = () => {
	const { results, rootActionId } = useMatches()

	const dedupedResults = useMemo(
		() =>
			results
				.filter(i => i !== NO_GROUP)
				.filter((a1, i, a) =>
					typeof a1 == 'string'
						? true
						: a.findIndex(a2 => (typeof a2 == 'string' ? false : a2.id === a1.id)) === i
				),
		[results]
	)

	return (
		<div className="relative">
			<KBarResults
				items={dedupedResults}
				onRender={({ item, active }) =>
					typeof item === 'string' ? (
						<p className="pb-1 pl-3 text-[.65rem] uppercase text-black/50 tracking-wide dark:text-neutral-300/50">
							{item}
						</p>
					) : (
						<ResultItem action={item} active={active} currentRootActionId={rootActionId as string} />
					)
				}
			/>
		</div>
	)
}

const ResultItem: FC<
	PropsWithRef<{
		action: ActionImpl
		active: boolean
		currentRootActionId: ActionId
	}>
> = forwardRef(({ action, active, currentRootActionId }, ref: Ref<HTMLDivElement>) => {
	const ancestors = useMemo(() => {
		if (!currentRootActionId) return action.ancestors

		const index = action.ancestors.findIndex(ancestor => ancestor.id === currentRootActionId)
		return action.ancestors.slice(index + 1)
	}, [action.ancestors, currentRootActionId])

	return (
		<div
			className={classNames(
				active && 'bg-black/5 dark:bg-white/10',
				'flex justify-between items-center cursor-pointer py-2.5 px-3 mx-1.5 mb-2 rounded-md transition-colors duration-[.15s] delay-[0]'
			)}
		>
			<div className="flex gap-3 items-center text-sm">
				<span className="w-5 h-5 opacity-50">{action.icon && action.icon}</span>

				<div className="flex mt-0.5 text-black/70 dark:text-white/70 space-x-2">
					<div>
						{ancestors.length > 0 &&
							ancestors.map((ancestor: ActionImpl) => (
								<span className="text-black/50 dark:text-white/50" key={ancestor.id}>
									<span>{ancestor.name}</span>
									<span className="mr-0.5"> &rsaquo; </span>
								</span>
							))}
						<span>{action.name}</span>
					</div>

					{action.subtitle && (
						<span className="p-0.5 px-1 bg-black/5 text-black/50 dark:bg-white/10 dark:text-white/40 rounded-md text-xs">
							{action.subtitle}
						</span>
					)}
				</div>
			</div>

			{action.shortcut?.length ? (
				<div aria-hidden className="flex items-center space-x-2">
					{action.shortcut
						.map(sc => sc.split('+'))
						.flat()
						.map(sc => (
							<kbd
								key={sc}
								className="py-px px-2 bg-black/5 text-black/50 dark:bg-white/10 dark:text-white/40 rounded-md text-sm flex items-center justify-center"
							>
								{normalizeKey(sc)}
							</kbd>
						))}
				</div>
			) : null}
		</div>
	)
})
ResultItem.displayName = 'ResultItem'

export default CommandBar