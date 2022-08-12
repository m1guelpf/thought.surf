import { ReactNode } from 'react'

export enum Sections {
	Account = 'account',
	Canvas = 'canvas',
	General = 'general',
	Social = 'social',
}

export enum Priority {
	LOW = -1,
	HIGH = 1,
	REGULAR = 0,
}

export type Action = {
	id: string
	name: string
	parent?: string
	icon: ReactNode
	subtitle?: string
	shortcut?: string
	section?: Sections
	fallback?: boolean
	keywords?: string[]
	priority?: Priority
	perform?: () => void
	hasChildren?: boolean
}
