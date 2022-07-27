import { REGEX } from './consts'
import toast from 'react-hot-toast'
import { Card } from '@/types/cards'
import { Camera } from '@/types/canvas'
import { createURLCard } from '@/components/Cards/URLCard'
import { createTextCard } from '@/components/Cards/TextCard'

export const cardFromPaste = (event: ClipboardEvent, camera: Camera): Card => {
	if (event.clipboardData.files.length > 0) throw toast.error('Pasting files is not supported yet.')

	const content = event.clipboardData.getData('text/plain').trim()

	if (REGEX.URL.test(content)) return createURLCard(camera, content)

	return createTextCard(camera, content)
}
