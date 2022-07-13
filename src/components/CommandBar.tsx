// import { useTheme } from 'next-themes'
// import { toast } from 'react-hot-toast'
// import { useRouter } from 'next/router'
import React, { FC, forwardRef, PropsWithChildren, PropsWithRef, Ref, useMemo, useRef } from 'react'
// import {
// 	CodeIcon,
// 	MoonIcon,
// 	DuplicateIcon,
// 	HomeIcon,
// 	MailIcon,
// 	SunIcon,
// 	UserIcon,
// 	DesktopComputerIcon,
// 	RssIcon,
// 	DocumentTextIcon,
// 	CollectionIcon,
// } from '@heroicons/react/outline'
import {
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
	useKBar,
	useMatches,
} from 'kbar'

// enum Sections {
// 	Navigation = 'navigation',
// 	Socials = 'socials',
// 	General = 'general',
// }

const CommandBar: FC<PropsWithChildren<{}>> = ({ children }) => {
	// const router = useRouter()
	// const { setTheme } = useTheme()

	// const actions = [
	// 	{
	// 		id: 'home',
	// 		name: 'Home',
	// 		icon: <HomeIcon />,
	// 		shortcut: ['h'],
	// 		section: Sections.Navigation,
	// 		keywords: 'home back main root index',
	// 		perform: () => router.push('/'),
	// 	},
	// 	{
	// 		id: 'about',
	// 		name: 'About',
	// 		icon: <UserIcon />,
	// 		shortcut: ['a'],
	// 		section: Sections.Navigation,
	// 		keywords: 'info',
	// 		perform: () => router.push('/about'),
	// 	},
	// 	{
	// 		id: 'blog',
	// 		name: 'Blog',
	// 		icon: <DocumentTextIcon />,
	// 		shortcut: ['b'],
	// 		section: Sections.Navigation,
	// 		keywords: 'writing articles content',
	// 		perform: () => router.push('/blog'),
	// 	},
	// 	{
	// 		id: 'stack',
	// 		name: 'Stack',
	// 		icon: <CollectionIcon />,
	// 		shortcut: ['s'],
	// 		section: Sections.Navigation,
	// 		keywords: 'gear tools',
	// 		perform: () => router.push('/stack'),
	// 	},
	// 	{
	// 		id: 'words',
	// 		name: 'Words',
	// 		icon: <DocumentTextIcon />,
	// 		shortcut: ['w'],
	// 		section: Sections.Navigation,
	// 		keywords: 'vocables',
	// 		perform: () => router.push('/words'),
	// 	},
	// 	// {
	// 	// 	id: 'twitter',
	// 	// 	name: 'Twitter',
	// 	// 	icon: <TwitterIcon />,
	// 	// 	section: Sections.Socials,
	// 	// 	keywords: 'twitter tweet',
	// 	// 	perform: () => window.open('https://twitter.com/lavgup'),
	// 	// },
	// 	// {
	// 	// 	id: 'github',
	// 	// 	name: 'GitHub',
	// 	// 	icon: <GitHubIcon />,
	// 	// 	shortcut: ['g'],
	// 	// 	section: Sections.Socials,
	// 	// 	perform: () => window.open('https://github.com/lavgup'),
	// 	// },
	// 	{
	// 		id: 'mail',
	// 		name: 'Mail',
	// 		icon: <MailIcon />,
	// 		shortcut: ['m'],
	// 		section: Sections.Socials,
	// 		keywords: 'email contact',
	// 		perform: () => window.open('mailto://lavyag01@gmail.com'),
	// 	},
	// 	{
	// 		id: 'theme',
	// 		name: 'Change theme...',
	// 		shortcut: ['t'],
	// 		icon: <DesktopComputerIcon />,
	// 		section: Sections.General,
	// 	},
	// 	{
	// 		id: 'light',
	// 		name: 'Light',
	// 		icon: <SunIcon />,
	// 		section: '',
	// 		keywords: 'light theme',
	// 		parent: 'theme',
	// 		perform: () => setTheme('light'),
	// 	},
	// 	{
	// 		id: 'dark',
	// 		name: 'Dark',
	// 		icon: <MoonIcon />,
	// 		section: '',
	// 		keywords: 'dark theme',
	// 		parent: 'theme',
	// 		perform: () => setTheme('dark'),
	// 	},
	// 	{
	// 		id: 'system',
	// 		name: 'System',
	// 		icon: <DesktopComputerIcon />,
	// 		section: '',
	// 		keywords: 'system theme',
	// 		parent: 'theme',
	// 		perform: () => setTheme('system'),
	// 	},
	// 	{
	// 		id: 'copy-url',
	// 		name: 'Copy URL to clipboard',
	// 		icon: <DuplicateIcon />,
	// 		shortcut: ['cc'],
	// 		section: Sections.General,
	// 		keywords: 'copy share url',
	// 		perform: async () => {
	// 			await navigator.clipboard.writeText('https://lavya.me' + router.asPath)

	// 			toast.success('Copied to clipboard!', {
	// 				className: 'text-neutral-600 dark:text-neutral-200/[.85] bg-white dark:bg-neutral-800',
	// 				duration: 3000,
	// 			})
	// 		},
	// 	},
	// 	{
	// 		id: 'rss',
	// 		name: 'RSS Feed',
	// 		icon: <RssIcon />,
	// 		section: Sections.General,
	// 		keywords: 'rss feed atom',
	// 		perform: async () => {
	// 			await navigator.clipboard.writeText('https://lavya.me/feed.xml')
	// 			await router.push('https://lavya.me/feed.xml')
	// 		},
	// 	},
	// 	{
	// 		id: 'source',
	// 		name: 'View source',
	// 		icon: <CodeIcon />,
	// 		shortcut: ['sc'],
	// 		section: Sections.General,
	// 		keywords: 'source code',
	// 		perform: () => window.open('https://github.com/lavgup/lavya.me'),
	// 	},
	// ]
	const actions = []

	return (
		<KBarProvider actions={actions} options={{ enableHistory: true }}>
			<KBarPortal>
				<KBarPositioner className="bg-white/80 dark:bg-black/80 pt-[10vh] px-4 pb-4 z-40">
					<KBarAnimator className="overflow-hidden w-full max-w-2xl bg-white rounded-lg shadow-2xl dark:bg-soft-black z-10">
						<div>
							<Breadcrumbs />
							<KBarSearch className="dark:placeholder:text-neutral-400/60 pt-11 pb-3.5 px-4 mb-3 w-full border-b-[1px] box-border outline-none dark:bg-soft-black dark:border-neutral-500/40" />
						</div>
						<div className="pb-1.5">
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
	const { results, rootActionId } = useMatches()
	const filtered = results.filter(r => typeof r !== 'string')

	const { query } = useKBar()

	const action = useMemo(() => filtered[0] as ActionImpl, [rootActionId])

	return (
		<ul className="absolute flex flex-row gap-x-1 px-4 py-2.5">
			<Breadcrumb text="home" query={query} />
			{action?.ancestors?.length > 0 &&
				action.ancestors?.map((el, idx) => <Breadcrumb key={idx} text={el.id} query={query} />)}
		</ul>
	)
}

const Breadcrumb: FC<{ text: string; query: KBarQuery }> = ({ text, query }) => {
	return (
		<button
			className="bg-gray-200 text-slate-600/90 dark:bg-neutral-800 dark:text-neutral-400/80 px-[.45rem] py-0.5 text-xs rounded-md capitalize"
			onClick={() => query.setCurrentRootAction(text === 'home' ? '' : text)}
		>
			{text}
		</button>
	)
}

const Results = () => {
	const { results, rootActionId } = useMatches()
	const wrapperRef = useRef(null)

	return (
		<div className="relative" ref={wrapperRef}>
			<KBarResults
				items={results.filter(i => i !== NO_GROUP)}
				onRender={({ item, active }) =>
					typeof item === 'string' ? (
						<p className="pt-3 pb-1 pl-3 text-[.65rem] uppercase dark:text-neutral-300/50">{item}</p>
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
	const ancestors = React.useMemo(() => {
		if (!currentRootActionId) return action.ancestors
		const index = action.ancestors.findIndex(ancestor => ancestor.id === currentRootActionId)
		return action.ancestors.slice(index + 1)
	}, [action.ancestors, currentRootActionId])

	return (
		<div
			ref={ref}
			className={`
					flex justify-between
					items-center cursor-pointer py-2 px-3 mx-1.5 rounded-md
					${active && 'bg-gray-200/70 dark:bg-neutral-600/30'}
					transition-colors duration-[.15s] delay-[0]
					dark:text-neutral-300/80
				`}
		>
			<div className="flex gap-3 items-center text-sm">
				<span className="w-5 h-5 opacity-70">{action.icon && action.icon}</span>

				<div className="flex flex-col mt-0.5">
					<div>
						{ancestors.length > 0 &&
							ancestors.map((ancestor: ActionImpl) => (
								<React.Fragment key={ancestor.id}>
									<span>{ancestor.name}</span>
									<span className="mr-0.5">&rsaquo;</span>
								</React.Fragment>
							))}
						<span>{action.name}</span>
					</div>

					{action.subtitle && <span className="text-[0.75rem]">{action.subtitle}</span>}
				</div>
			</div>

			{action.shortcut?.length ? (
				<div aria-hidden className="grid grid-flow-cols">
					{action.shortcut.map(sc => (
						<kbd key={sc} className="py-[.1rem] px-[.325rem] bg-black/10 rounded-md text-md">
							{sc}
						</kbd>
					))}
				</div>
			) : null}
		</div>
	)
})
ResultItem.displayName = 'ResultItem'

export default CommandBar
