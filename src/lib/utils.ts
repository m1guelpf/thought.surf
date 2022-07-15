import { v4 as uuidv4 } from 'uuid'

export const classNames = (...classes: string[]): string => classes.filter(Boolean).join(' ')

export const normalizeKey = (keyCode: string) => {
	if (keyCode === 'Meta') return '⌘'
	if (keyCode === 'Equal') return '+'
	if (keyCode === 'Minus') return '-'

	return keyCode
}

export const randomId = (): string => uuidv4()
