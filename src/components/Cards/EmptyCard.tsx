import { FC } from 'react'
import { screenToCanvas } from '@/lib/canvas'
import { Card, CardType } from '@/types/cards'
import { Camera, Point } from '@/types/canvas'
import { Sections } from '@/types/command-bar'
import { LiveObject } from '@liveblocks/client'
import useRegisterAction from '@/hooks/useRegisterAction'
import { CubeTransparentIcon } from '@heroicons/react/outline'

export const emptyCardOptions = { resizeAxis: { x: true, y: true } }

const EmptyCard: FC<{ item: LiveObject<Card>; id: string; navigateTo: () => void }> = ({ id, item, navigateTo }) => {
	useRegisterAction(
		{
			id: `canvas-item-${id}`,
			name: 'Untitled',
			icon: <CubeTransparentIcon />,
			parent: 'canvas',
			section: Sections.Canvas,
			perform: navigateTo,
		},
		[item]
	)

	return null
}

export const createEmptyCard = (camera: Camera, { point }: { point?: Point } = {}): Card => ({
	type: CardType.EMPTY,
	size: { width: 500, height: 500 },
	point: screenToCanvas(point ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 }, camera),
})

export default EmptyCard
