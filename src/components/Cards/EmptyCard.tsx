import { Camera } from '@/types/canvas'
import { screenToCanvas } from '@/lib/canvas'
import { Card, CardType } from '@/types/cards'

export const emptyCardOptions = { resizeAxis: { x: true, y: true } }

const EmptyCard = () => {
	return null
}

export const createEmptyCard = (camera: Camera): Card => ({
	type: CardType.TEXT,
	size: { width: 500, height: 500 },
	point: screenToCanvas({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, camera),
})

export default EmptyCard
