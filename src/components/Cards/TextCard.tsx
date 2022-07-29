import TipTap from '../TipTap'
import useItem from '@/hooks/useItem'
import { Camera } from '@/types/canvas'
import { FC, memo, useEffect } from 'react'
import useMeasure from '@/hooks/useMeasure'
import { screenToCanvas } from '@/lib/canvas'
import { Sections } from '@/types/command-bar'
import { LiveObject } from '@liveblocks/client'
import useRegisterAction from '@/hooks/useRegisterAction'
import { DocumentTextIcon } from '@heroicons/react/outline'
import { CardOptions, CardType, TextCard } from '@/types/cards'

export const textCardOptions: CardOptions = {
	resizeAxis: { x: true, y: false },
}

const TextCard: FC<{ item: LiveObject<TextCard>; id: string; navigateTo: () => void }> = ({ id, item, navigateTo }) => {
	const [measureRef, { height }] = useMeasure<HTMLDivElement>()
	const {
		attributes: { doc },
	} = useItem(item)

	useEffect(() => {
		const { width } = item.get('size')

		item.set('size', { width, height: height + 20 })
	}, [item, height])

	useRegisterAction(
		{
			id: `canvas-item-${id}`,
			name: 'Untitled',
			icon: <DocumentTextIcon />,
			parent: 'canvas',
			section: Sections.Canvas,
			perform: navigateTo,
		},
		[item]
	)

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

export const createTextCard = (camera: Camera, text: string = 'What are you thinking about?'): TextCard => ({
	point: screenToCanvas({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, camera),
	size: { width: 500, height: 500 },
	type: CardType.TEXT,
	attributes: {
		doc: {
			type: 'doc',
			content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
		},
	},
})

export default memo(TextCard)
