import { Point } from './canvas'
import { MouseEvent, ReactNode } from 'react'

export type MenuItem = {
	label: string
	shortcut?: string
	icon?: ReactNode
	items?: MenuItem[]
	action?: (event: MouseEvent, mouse: Point) => void
	submenu?: MenuItem[]
} & (
	| { items: MenuItem[]; submenu?: never; action?: never }
	| { items?: never; submenu: MenuItem[]; action?: never }
	| { items?: never; submenu?: never; action: (event: MouseEvent, mouse: Point) => void }
)

export type Menu = MenuItem[]
