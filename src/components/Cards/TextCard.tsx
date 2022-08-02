import Card from '../Card'
import TipTap from '../TipTap'
import { getName } from '@/lib/names'
import useItem from '@/hooks/useItem'
import useMeasure from '@/hooks/useMeasure'
import { screenToCanvas } from '@/lib/canvas'
import { Camera, Point } from '@/types/canvas'
import { Sections } from '@/types/command-bar'
import { XIcon } from '@heroicons/react/solid'
import { LiveObject } from '@liveblocks/client'
import { CardType, TextCard } from '@/types/cards'
import { FC, memo, useEffect, useRef } from 'react'
import useRegisterAction from '@/hooks/useRegisterAction'
import { DocumentTextIcon } from '@heroicons/react/outline'

type Props = { item: LiveObject<TextCard>; id: string; navigateTo: () => void; onDelete: () => void }

const TextCard: FC<Props> = ({ id, item, navigateTo, onDelete }) => {
	const renderTiptapMenu = useRef<HTMLDivElement>(null)
	const [measureRef, { height }] = useMeasure<HTMLDivElement>()
	const {
		attributes: { doc, title },
	} = useItem(item)

	useEffect(() => {
		const { width } = item.get('size')

		item.set('size', { width, height: height + 20 })
	}, [item, height])

	useRegisterAction(
		{
			id: `canvas-item-${id}`,
			name: title,
			icon: <DocumentTextIcon />,
			parent: 'canvas',
			section: Sections.Canvas,
			perform: navigateTo,
		},
		[item, title]
	)

	return (
		<Card id={id} item={item} onDelete={onDelete} options={{ resizeAxis: { x: true, y: false } }}>
			<div className="absolute bottom-4 inset-x-4 bg-white dark:bg-gray-900 shadow py-2 px-2 rounded-lg opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-between overflow-hidden z-30">
				<div className="flex items-center space-x-2 flex-shrink flex-grow ml-2 relative min-w-0">
					<DocumentTextIcon className="w-4 h-4 absolute left-0 inset-y-1/4 text-gray-400 z-[1]" />
					<input
						className="bg-transparent rounded-lg w-full p-1 px-2 pl-7 !-ml-2 text-gray-600 dark:text-gray-400 z-[2]"
						value={title}
						onChange={event => item.set('attributes', { doc, title: event.target.value })}
					/>
				</div>
				<div className="flex items-center space-x-2 flex-shrink-0">
					<div className="flex items-center space-x-0.5" ref={renderTiptapMenu} />
					<button
						onClick={onDelete}
						className="bg-gray-200/60 dark:bg-gray-700/60 rounded p-1 opacity-80 hover:opacity-100 transition-opacity"
					>
						<XIcon className="w-4 h-4" />
					</button>
				</div>
			</div>
			<div className="w-full" ref={measureRef}>
				<TipTap
					doc={doc}
					renderMenu={renderTiptapMenu}
					setDoc={doc => item.set('attributes', { doc, title })}
					editorClassName="bg-black/[.01] dark:bg-black/80 rounded-lg"
				/>
			</div>
		</Card>
	)
}

export const createTextCard = (
	camera: Camera,
	{ text = 'What are you thinking about?', point, names }: { text?: string; point?: Point; names?: string[] } = {}
): TextCard => ({
	point: screenToCanvas(point ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 }, camera),
	size: { width: 500, height: 500 },
	type: CardType.TEXT,
	attributes: {
		title: names ? getName('Untitled', names) : 'Untitled',
		doc: {
			type: 'doc',
			content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
		},
	},
})

export default memo(TextCard)
