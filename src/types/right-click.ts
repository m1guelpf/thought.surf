import { Point } from './canvas'
import { MouseEvent, ReactNode } from 'react'

type BaseItem = {
	label: string
	icon?: ReactNode
	shortcut?: string
}

export type Group = BaseItem & { items: Menu }
export type SubMenu = BaseItem & { submenu: Menu }
export type Item = BaseItem & {
	action: (event: MouseEvent, mouse: Point) => void
}
export type Checkbox = BaseItem & {
	checked: boolean
	onChange: (checked: boolean) => void
}

export type Menu = Array<MenuItem>
export type MenuItem = Group | SubMenu | Checkbox | Item
