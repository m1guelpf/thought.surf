import { classNames } from '@/lib/utils'
import { Menu, MenuItem } from '@/types/right-click'
import { ChevronRightIcon } from '@heroicons/react/outline'
import * as ContextMenu from '@radix-ui/react-context-menu'
import { FC, memo, PointerEventHandler, PropsWithChildren, ReactNode } from 'react'

const RightClickMenu: FC<PropsWithChildren<{ menu?: Menu }>> = ({ children, menu = [] }) => {
	if (menu.length == 0) return <>{children}</>

	const handlePointerDown: PointerEventHandler<HTMLSpanElement> = event => {
		event.stopPropagation()
	}

	return (
		<ContextMenu.Root>
			<ContextMenu.Trigger onPointerDown={handlePointerDown} asChild>
				{children}
			</ContextMenu.Trigger>

			<ContextMenu.Portal>
				<ContextMenu.Content
					className={classNames(
						'bg-white dark:bg-gray-800',
						'w-48 rounded-lg px-1.5 py-1 shadow-md md:w-56',
						'side-top:animate-slide-up side-bottom:animate-slide-down'
					)}
				>
					{menu.map((item, i) => (
						<MenuRenderer key={i} item={item} isFirst={i == 0} />
					))}
				</ContextMenu.Content>
			</ContextMenu.Portal>
		</ContextMenu.Root>
	)
}

const MenuRenderer: FC<{ item: MenuItem; isFirst?: boolean }> = ({ item, isFirst = false }) => {
	if (item.submenu) {
		return (
			<>
				{!isFirst && <ContextMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />}
				<SubMenuRenderer item={item} />
			</>
		)
	}

	if (item.items) {
		return (
			<>
				{!isFirst && <ContextMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />}
				<ContextMenu.Label className="select-none px-2 py-2 text-xs text-gray-700 dark:text-gray-200">
					{item.label}
				</ContextMenu.Label>
				{item.items.map((item, i) => (
					<MenuRenderer key={i} item={item} />
				))}
			</>
		)
	}

	return (
		<ContextMenu.Item asChild>
			<button
				onClick={item.action}
				className={classNames(
					'w-full text-left',
					'text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900',
					'flex cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none'
				)}
			>
				<MenuItemIcon icon={item.icon} />
				<MenuItemLabel label={item.label} />
				{item.shortcut && <span className="text-xs">{item.shortcut}</span>}
			</button>
		</ContextMenu.Item>
	)
}

const SubMenuRenderer: FC<{ item: MenuItem }> = ({ item }) => (
	<ContextMenu.Sub>
		<ContextMenu.SubTrigger
			className={classNames(
				'flex w-full cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none',
				'text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900'
			)}
		>
			<MenuItemIcon icon={item.icon} />
			<MenuItemLabel label={item.label} />
			<ChevronRightIcon className="h-3.5 w-3.5" />
		</ContextMenu.SubTrigger>
		<ContextMenu.Portal>
			<ContextMenu.SubContent
				className={classNames(
					'origin-radix-context-menu side-right:animate-scale-in',
					'w-full rounded-md px-1 py-1 text-xs shadow-md',
					'bg-white dark:bg-gray-800'
				)}
			>
				{item.submenu.map((item, i) => (
					<MenuRenderer key={i} item={item} />
				))}
			</ContextMenu.SubContent>
		</ContextMenu.Portal>
	</ContextMenu.Sub>
)

const MenuItemIcon: FC<{ icon: ReactNode }> = ({ icon }) => <div className="mr-2">{icon}</div>
const MenuItemLabel: FC<{ label: string }> = ({ label }) => (
	<span className="flex-grow text-gray-700 dark:text-gray-300">{label}</span>
)

export default memo(RightClickMenu)
