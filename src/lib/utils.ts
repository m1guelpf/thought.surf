import { parse } from 'tldts'
import { nanoid } from 'nanoid'
import toast from 'react-hot-toast'
import _copy from 'copy-to-clipboard'

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
export const randomNum = (min: number, max: number): number => {
	min = Math.ceil(min)
	max = Math.floor(max)

	return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getSubdomain = (host: string): string => {
	if (host.includes('localhost:')) return host.split('localhost:')[0].replace(/\.$/, '')

	return parse(host).subdomain
}

export const getDomain = (url: string): string => {
    try {
        return new URL(url)?.host
    } catch {
        return url
    }
}

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

export const copy = (text: string) => {
	_copy(text, { onCopy: () => toast.success('Copied!') })
}

export const capitalize = (text: string): string => {
	return text.charAt(0).toUpperCase() + text.slice(1)
}

export const modulate = (value: number, rangeA: number[], rangeB: number[], clamp = false): number => {
	const [fromLow, fromHigh] = rangeA
	const [v0, v1] = rangeB
	const result = v0 + ((value - fromLow) / (fromHigh - fromLow)) * (v1 - v0)

	return clamp ? (v0 < v1 ? Math.max(Math.min(result, v1), v0) : Math.max(Math.min(result, v0), v1)) : result
}
