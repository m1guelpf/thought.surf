import { Point } from './canvas'
import { MouseEvent, ReactNode } from 'react'

type BaseItem = {
	label: string
	icon?: ReactNode
	shortcut?: string
}

type Group = BaseItem & { items: Menu }
type SubMenu = BaseItem & { submenu: Menu }
type Item = BaseItem & {
	action: (event: MouseEvent, mouse: Point) => void
}
type Checkbox = BaseItem & {
	checked: boolean
	onChange: (checked: boolean) => void
}

export type Menu = Array<MenuItem>
export type MenuItem = Group | SubMenu | Checkbox | Item
