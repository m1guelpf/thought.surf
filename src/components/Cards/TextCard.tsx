import Card from '../Card'
import TipTap from '../TipTap'
import { getName } from '@/lib/names'
import useMeasure from '@/hooks/useMeasure'
import { screenToCanvas } from '@/lib/canvas'
import { Camera, Point } from '@/types/canvas'
import { Sections } from '@/types/command-bar'
import { classNames, randomId } from '@/lib/utils'
import { XMarkIcon } from '@heroicons/react/16/solid'
import { CardType, type TextCard } from '@/types/cards'
import useRegisterAction from '@/hooks/useRegisterAction'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { useDeleteCard, useReorderCard, useUpdateCard } from '@/hooks/useCard'
import { FC, memo, MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react'

type Props = {
	id: string
	card: TextCard
	navigateTo: () => void
	containerRef: MutableRefObject<HTMLDivElement>
}

const cardOptions = { resizeAxis: { x: true, y: false } }

const TextCard: FC<Props> = ({ id, card, navigateTo, containerRef }) => {
	const updateCard = useUpdateCard(card.id)
	const reorderCard = useReorderCard(card.id)
	const renderTiptapMenu = useRef<HTMLDivElement>(null)
	const [measureRef, { height }] = useMeasure<HTMLDivElement>()

	useEffect(() => {
		if (card.size.height == height + 20) return

		const { width } = card.size
		updateCard({ size: { width, height: height + 20 } })
	}, [card, height])

	useRegisterAction(
		{
			id: `canvas-item-${id}`,
			name: card.attributes.title,
			icon: <DocumentTextIcon />,
			parent: 'canvas',
			section: Sections.Canvas,
			perform: navigateTo,
		},
		[id, card.attributes.title]
	)

	const Header = useMemo(() => <CardHeader card={card} renderMenu={renderTiptapMenu} />, [card])

	const onDocUpdate = useCallback(
		doc =>
			updateCard(card => {
				card.attributes.doc = doc
				return card
			}),
		[card]
	)

	return (
		<Card id={id} card={card} header={Header} options={cardOptions} containerRef={containerRef}>
			<div className="w-full" onPointerDown={reorderCard} ref={measureRef}>
				<TipTap
					setDoc={onDocUpdate}
					doc={card.attributes.doc}
					renderMenu={renderTiptapMenu}
					editorClassName="bg-black/[.01] dark:bg-black/80 rounded-lg"
				/>
			</div>
		</Card>
	)
}

type CardHeaderProps = {
	card: TextCard
	renderMenu: MutableRefObject<HTMLDivElement>
}

const CardHeader: FC<CardHeaderProps> = memo(({ card, renderMenu }) => {
	const updateCard = useUpdateCard(card.id)
	const deleteCard = useDeleteCard(card.id)
	const updateTitle = useCallback(
		event => {
			updateCard(card => {
				card.attributes.title = event.target.value
				return card
			})
		},
		[updateCard]
	)

	return (
		<div
			className={classNames(
				'opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300',
				'flex items-center justify-between bg-gray-100/40 dark:bg-black/40 backdrop-blur backdrop-filter p-2 rounded-lg w-full space-x-2'
			)}
		>
			<input
				onChange={updateTitle}
				value={card.attributes.title}
				className="bg-transparent text-lg rounded-lg w-full p-1 px-2 text-black/60 dark:text-white/60"
				onKeyDown={e => {
					if (e.key !== 'Enter') return
					;(e.target as HTMLInputElement).blur()
				}}
			/>
			<div className="flex items-center space-x-1 flex-shrink-0">
				<div className="flex items-center space-x-0.5" ref={renderMenu} />
				<button
					onClick={deleteCard}
					className="bg-gray-200/60 dark:bg-gray-700/60 rounded p-1 opacity-80 hover:opacity-100 transition-opacity"
				>
					<XMarkIcon className="w-5 h-5" />
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
