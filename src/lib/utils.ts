import { v4 as uuidv4 } from 'uuid'

export const classNames = (...classes: string[]): string => classes.filter(Boolean).join(' ')

export const normalizeKey = (keyCode: string) => {
	if (keyCode === '$mod') return '⌘'
	if (keyCode === 'Meta') return '⌘'
	if (keyCode === 'Shift') return '⇧'
	if (keyCode === 'Minus') return '-'
	if (keyCode.startsWith('Key')) return keyCode.slice(3).toLowerCase()
	if (keyCode === 'Equal') return '+' // For better zoom UX, US keyboard layout

	return keyCode
}

export const randomId = (): string => uuidv4()
