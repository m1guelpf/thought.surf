import TipTap from '../TipTap'
import { Camera } from '@/types/canvas'
import { useRoom } from '@/lib/liveblocks'
import useMeasure from '@/hooks/useMeasure'
import { DEFAULT_TEXT } from '@/lib/consts'
import { screenToCanvas } from '@/lib/canvas'
import { LiveObject } from '@liveblocks/client'
import { FC, memo, useEffect, useState } from 'react'
import { CardOptions, CardType, TextCard } from '@/types/cards'

export const textCardOptions: CardOptions = {
	resizeAxis: { x: true, y: false },
}

const TextCard: FC<{ item: LiveObject<TextCard>; id: string }> = ({ item }) => {
	const room = useRoom()
	const [measureRef, { height }] = useMeasure<HTMLDivElement>()
	const [
		{
			attributes: { doc },
		},
		setItem,
	] = useState(item.toObject())

	useEffect(() => {
		function onChange() {
			setItem(item.toObject())
		}

		return room.subscribe(item, onChange)
	}, [room, item])

	useEffect(() => {
		const { width } = item.get('size')

		item.set('size', { width, height: height + 20 })
	}, [item, height])

	return (
		<div className="w-full" ref={measureRef}>
			<TipTap
				editorClassName="bg-black/[.01] dark:bg-black/80 rounded-lg"
				doc={doc}
				setDoc={doc => item.set('attributes', { doc })}
			/>
		</div>
	)
}

export const createTextCard = (camera: Camera): TextCard => ({
	point: screenToCanvas({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, camera),
	size: { width: 500, height: 500 },
	type: CardType.TEXT,
	attributes: { doc: DEFAULT_TEXT },
})

export default memo(TextCard)
