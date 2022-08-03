import { REGEX } from './consts'
import toast from 'react-hot-toast'
import { Camera } from '@/types/canvas'
import { createURLCard } from '@/components/Cards/URLCard'
import { createTextCard } from '@/components/Cards/TextCard'
import { Card, CardCollection, CardType, TextCard } from '@/types/cards'

export const cardFromPaste = (event: ClipboardEvent, camera: Camera, names: string[]): Card => {
	if (event.clipboardData.files.length > 0) throw toast.error('Pasting files is not supported yet.')

	const content = event.clipboardData.getData('text/plain').trim()

	if (REGEX.URL.test(content)) return createURLCard(camera, { url: content })

	return createTextCard(camera, { text: content, names })
}

export const cardFromDrag = (event: DragEvent, camera: Camera, names: string[]): Card[] => {
	if (event.dataTransfer.files.length > 0) {
		toast.error('Dropping files is not supported yet.')
		return []
	}

	if ([...event.dataTransfer.types].includes('text/uri-list')) {
		const urlList = event.dataTransfer
			.getData('text/uri-list')
			.split('\n')
			.filter(url => !url.startsWith('#'))

		return urlList.map(url => createURLCard(camera, { point: { x: event.clientX, y: event.clientY }, url }))
	}

	if (![...event.dataTransfer.types].includes('text/plain')) {
		toast.error('Unsupported element.')
		return []
	}

	return [
		createTextCard(camera, {
			names,
			point: { x: event.clientX, y: event.clientY },
			text: event.dataTransfer.getData('text/plain'),
		}),
	]
}

export const findCardIndex = (cards: CardCollection, id: string): number => {
	return cards.findIndex(card => card.get('id') === id)
}
export const findCard = (cards: CardCollection, id: string): Card | undefined => {
	return cards.find(card => card.get('id') === id).toObject()
}

export const getTextCards = (cards: CardCollection): TextCard[] => {
	return cards.map(card => card.toObject()).filter(({ type }) => type === CardType.TEXT) as TextCard[]
}
