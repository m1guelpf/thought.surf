import { REGEX } from './consts'
import toast from 'react-hot-toast'
import { Camera } from '@/types/canvas'
import { LiveMap, LiveObject } from '@liveblocks/client'
import { createURLCard } from '@/components/Cards/URLCard'
import { createTextCard } from '@/components/Cards/TextCard'
import { Card, CardCollection, CardType, TextCard } from '@/types/cards'

export const cardFromPaste = (event: ClipboardEvent, camera: Camera, names: string[]): Card => {
	if (event.clipboardData.files.length > 0) throw toast.error('Pasting files is not supported yet.')

	const content = event.clipboardData.getData('text/plain').trim()

	if (REGEX.URL.test(content)) return createURLCard(camera, { url: content })

	return createTextCard(camera, { text: content, names })
}

export const getTextCards = (cards: CardCollection): TextCard[] => {
	return [...cards.values()].map(item => item.toObject()).filter(({ type }) => type === CardType.TEXT) as TextCard[]
}
