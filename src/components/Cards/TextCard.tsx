import Card from '../Card'
import TipTap from '../TipTap'
import { getName } from '@/lib/names'
import useCard from '@/hooks/useCard'
import useMeasure from '@/hooks/useMeasure'
import { screenToCanvas } from '@/lib/canvas'
import { Camera, Point } from '@/types/canvas'
import { Sections } from '@/types/command-bar'
import { LiveObject } from '@liveblocks/client'
import { XIcon } from '@heroicons/react/outline'
import { classNames, randomId } from '@/lib/utils'
import { CardType, TextCard } from '@/types/cards'
import useRegisterAction from '@/hooks/useRegisterAction'
import { DocumentTextIcon } from '@heroicons/react/outline'
import { FC, memo, MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react'

type Props = {
	id: string
	onDelete: () => void
	onReorder: () => void
	navigateTo: () => void
	card: LiveObject<TextCard>
	containerRef: MutableRefObject<HTMLDivElement>
}

const cardOptions = { resizeAxis: { x: true, y: false } }

const TextCard: FC<Props> = ({ id, card, navigateTo, onDelete, onReorder, containerRef }) => {
	const renderTiptapMenu = useRef<HTMLDivElement>(null)
	const [measureRef, { height }] = useMeasure<HTMLDivElement>()
	const {
		attributes: { doc, title },
	} = useCard(card)

	useEffect(() => {
		const { width } = card.get('size')

		card.set('size', { width, height: height + 20 })
	}, [card, height])

	useRegisterAction(
		{
			id: `canvas-item-${id}`,
			name: title,
			icon: <DocumentTextIcon />,
			parent: 'canvas',
			section: Sections.Canvas,
			perform: navigateTo,
		},
		[card, title]
	)

	const Header = useMemo(
		() => <CardHeader card={card} onDelete={onDelete} renderMenu={renderTiptapMenu} />,
		[card, onDelete]
	)

	const onDocUpdate = useCallback(doc => card.set('attributes', { doc, title: card.get('attributes').title }), [card])

	return (
		<Card
			id={id}
			card={card}
			header={Header}
			onDelete={onDelete}
			onReorder={onReorder}
			options={cardOptions}
			containerRef={containerRef}
		>
			<div className="w-full" onPointerDown={onReorder} ref={measureRef}>
				<TipTap
					doc={doc}
					setDoc={onDocUpdate}
					renderMenu={renderTiptapMenu}
					editorClassName="bg-black/[.01] dark:bg-black/80 rounded-lg"
				/>
			</div>
		</Card>
	)
}

type CardHeaderProps = {
	onDelete: () => void
	card: LiveObject<TextCard>
	renderMenu: MutableRefObject<HTMLDivElement>
}

const CardHeader: FC<CardHeaderProps> = memo(({ card, onDelete, renderMenu }) => {
	const {
		attributes: { title },
	} = useCard(card)

	const updateTitle = useCallback(
		event => card.set('attributes', { doc: card.get('attributes').doc, title: event.target.value }),
		[card]
	)

	return (
		<div
			className={classNames(
				'opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300',
				'flex items-center justify-between bg-gray-100/40 dark:bg-black/40 backdrop-blur backdrop-filter p-2 rounded-lg w-full space-x-2'
			)}
		>
			<input
				value={title}
				onChange={updateTitle}
				className="bg-transparent text-lg rounded-lg w-full p-1 px-2 text-black/60 dark:text-white/60"
				onKeyDown={e => {
					if (e.key !== 'Enter') return
					;(e.target as HTMLInputElement).blur()
				}}
			/>
			<div className="flex items-center space-x-1 flex-shrink-0">
				<div className="flex items-center space-x-0.5" ref={renderMenu} />
				<button
					onClick={onDelete}
					className="bg-gray-200/60 dark:bg-gray-700/60 rounded p-1 opacity-80 hover:opacity-100 transition-opacity"
				>
					<XIcon className="w-5 h-5" />
				</button>
			</div>
		</div>
	)
})
CardHeader.displayName = 'CardHeader'

export const createTextCard = (
	camera: Camera,
	{ text = 'What are you thinking about?', point, names }: { text?: string; point?: Point; names?: string[] } = {}
): TextCard => ({
	id: randomId(),
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
