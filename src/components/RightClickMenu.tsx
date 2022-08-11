import { Point } from '@/types/canvas'
import { classNames } from '@/lib/utils'
import { CheckIcon } from '@heroicons/react/solid'
import { ChevronRightIcon } from '@heroicons/react/outline'
import * as ContextMenu from '@radix-ui/react-context-menu'
import { Checkbox, Group, Item, Menu, MenuItem, SubMenu } from '@/types/right-click'
import { FC, memo, PointerEventHandler, PropsWithChildren, ReactNode, RefObject, useRef } from 'react'

const RightClickMenu: FC<PropsWithChildren<{ menu?: Menu }>> = ({ children, menu = [] }) => {
	const mousePos = useRef<Point>({ x: 0, y: 0 })

	if (menu.length == 0) return <>{children}</>

	const handlePointerDown: PointerEventHandler<HTMLSpanElement> = event => {
		event.stopPropagation()
		mousePos.current = { x: event.clientX, y: event.clientY }
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
						<MenuRenderer key={i} item={item} isFirst={i == 0} mouse={mousePos} />
					))}
				</ContextMenu.Content>
			</ContextMenu.Portal>
		</ContextMenu.Root>
	)
}

const MenuRenderer: FC<{ item: MenuItem; isFirst?: boolean; mouse?: RefObject<Point> }> = ({
	item,
	isFirst = false,
	mouse,
}) => {
	if ((item as SubMenu).submenu) {
		return (
			<>
				{!isFirst && <ContextMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />}
				<SubMenuRenderer item={item as SubMenu} mouse={mouse} />
			</>
		)
	}

	if ((item as Group).items) {
		return (
			<>
				{!isFirst && <ContextMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />}
				<ContextMenu.Label className="select-none px-2 py-2 text-xs text-gray-700 dark:text-gray-200">
					{item.label}
				</ContextMenu.Label>
				{(item as Group).items.map((item, i) => (
					<MenuRenderer key={i} item={item} />
				))}
			</>
		)
	}

	if ((item as Checkbox).onChange) {
		return (
			<ContextMenu.CheckboxItem
				checked={(item as Checkbox).checked}
				onCheckedChange={(item as Checkbox).onChange}
				className={classNames(
					'w-full text-left',
					'text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900',
					'flex cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none'
				)}
			>
				<MenuItemIcon icon={item.icon} />
				<MenuItemLabel label={item.label} />
				{(item as Checkbox).checked && <MenuItemIcon icon={<CheckIcon className="w-3.5 h-3.5" />} />}
			</ContextMenu.CheckboxItem>
		)
	}

	return (
		<ContextMenu.Item asChild>
			<button
				onClick={event => (item as Item).action(event, mouse.current)}
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

const SubMenuRenderer: FC<{ item: SubMenu; mouse?: RefObject<Point> }> = ({ item, mouse }) => (
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
					<MenuRenderer key={i} item={item} mouse={mouse} />
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
