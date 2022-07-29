import { ReactNode } from 'react'

export type MenuItem = {
	label: string
	shortcut?: string
	icon?: ReactNode
	items?: MenuItem[]
	action?: (event: MouseEvent) => void
	submenu?: MenuItem[]
} & (
	| { items: MenuItem[]; submenu?: never; action?: never }
	| { items?: never; submenu: MenuItem[]; action?: never }
	| { items?: never; submenu?: never; action: () => void }
)

export type Menu = MenuItem[]
