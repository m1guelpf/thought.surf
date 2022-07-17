import { ReactNode } from 'react'

export enum Sections {
	Account = 'account',
	Canvas = 'canvas',
	General = 'general',
	Social = 'social',
}

enum Priority {
	LOW = -1,
	HIGH = 1,
	REGULAR = 0,
}

export type Action = {
	id: string
	parent?: string
	icon: ReactNode
	subtitle?: string
	shortcut?: string
	section?: Sections
	fallback?: boolean
	keywords?: string[]
	priority?: Priority
	perform?: (query: string) => void
	hasChildren?: boolean
	name: string | ((string) => string)
}
