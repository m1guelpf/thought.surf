import toast from 'react-hot-toast'
import { Camera } from '@/types/canvas'
import { uploadFile } from './file-upload'
import { MIME_TYPES, REGEX } from './consts'
import { LiveObject } from '@liveblocks/client'
import { createURLCard } from '@/components/Cards/URLCard'
import { createTextCard } from '@/components/Cards/TextCard'
import { createFileCard } from '@/components/Cards/FileCard'
import { Card, CardCollection, CardType, TextCard } from '@/types/cards'

export const cardFromPaste = async (event: ClipboardEvent, camera: Camera, names: string[]): Promise<Card> => {
	if (event.clipboardData.files.length > 0) {
		const file = event.clipboardData.files[0]
		if (!MIME_TYPES.includes(file.type)) throw toast.error('File type is not supported yet.')
		if (event.clipboardData.files.length > 1) throw toast.error('Pasting multiple files is not supported yet.')

		return createFileCard(camera, { name: file.name, mimeType: file.type, url: await uploadFile(file), names })
	}

	const content = event.clipboardData.getData('text/plain').trim()

	if (REGEX.URL.test(content)) return createURLCard(camera, { url: content })
	return createTextCard(camera, { text: content, names })
}

export const cardFromDrag = async (event: DragEvent, camera: Camera, names: string[]): Promise<Card[]> => {
	if (event.dataTransfer.files.length > 0) {
		return Promise.all(
			[...event.dataTransfer.files].map(async file => {
				if (!MIME_TYPES.includes(file.type)) throw toast.error('File type is not supported yet.')

				return createFileCard(camera, {
					names,
					name: file.name,
					mimeType: file.type,
					url: await uploadFile(file),
					point: { x: event.clientX, y: event.clientY },
				})
			})
		)
	}

	if ([...event.dataTransfer.types].includes('text/uri-list')) {
		const urlList = event.dataTransfer
			.getData('text/uri-list')
			.split('\n')
			.filter(url => !url.startsWith('#'))

		return urlList.map(url => createURLCard(camera, { point: { x: event.clientX, y: event.clientY }, url }))
	}

	if (![...event.dataTransfer.types].includes('text/plain')) throw toast.error('Unsupported element.')

	return [
		createTextCard(camera, {
			names,
			point: { x: event.clientX, y: event.clientY },
			text: event.dataTransfer.getData('text/plain'),
		}),
	]
}

export const getNamedCards = (cards: readonly Card[]): TextCard[] => {
	return cards.filter(({ type }) => [CardType.TEXT, CardType.FILE].includes(type)) as TextCard[]
}
