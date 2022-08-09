import { parse } from 'tldts'
import { nanoid } from 'nanoid'

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

export const randomId = (): string => nanoid()

export const getSubdomain = (host: string): string => {
	if (host.includes('localhost:')) return host.split('localhost:')[0].replace(/\.$/, '')

	return parse(host).subdomain
}

export const getDomain = (url: string): string => new URL(url).host

export const ask = (message: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		const response = prompt(message)

		if (response === null) reject(new Error('User cancelled'))

		resolve(response)
	})
}

export const requestFile = (mimeTypes?: string[]): Promise<File> => {
	return new Promise((resolve, reject) => {
		const input = document.createElement('input')
		input.type = 'file'
		if (mimeTypes) input.accept = mimeTypes.join(', ')
		input.onchange = e => {
			const file = (e.target as HTMLInputElement).files[0]

			if (!file) reject(new Error('No file selected'))
			resolve(file)
		}

		input.click()
	})
}
