import useCard from '@/hooks/useCard'
import URLCard from './Cards/URLCard'
import TextCard from './Cards/TextCard'
import TweetCard from './Cards/TweetCard'
import { Card, CardType } from '@/types/cards'
import { LiveObject } from '@liveblocks/client'
import { useCallback, memo, FC, useRef, useMemo } from 'react'
import useCamera, { shallow, CameraStore } from '@/store/camera'

const CardRenderers: Record<
	string,
	FC<{ id: string; card: LiveObject<Card>; navigateTo: () => void; onDelete: () => void; onReorder: () => void }>
> = {
	[CardType.URL]: URLCard,
	[CardType.TEXT]: TextCard,
	[CardType.TWEET]: TweetCard,
}

const getParams = (store: CameraStore) => ({ zoomOn: store.zoomOnPoint, setTransition: store.setTransitioning })

type Props = {
	id: string
	card: LiveObject<Card>
	reorderCard: (id: string) => void
	removeCard: (id: string) => unknown
}

const CanvasItem: FC<Props> = ({ id, card, reorderCard, removeCard }) => {
	const { type } = useCard(card)
	const containerRef = useRef<HTMLDivElement>(null)
	const { zoomOn, setTransition } = useCamera(getParams, shallow)
	const onDelete = useCallback(() => removeCard(id), [id, removeCard])
	const onReorder = useCallback(() => reorderCard(id), [id, reorderCard])

	const navigateTo = useCallback(() => {
		const rect = containerRef.current.getBoundingClientRect()

		setTransition(true)
		zoomOn(card.get('point'), { width: rect.width, height: rect.height })
	}, [card, zoomOn, setTransition])

	const RenderCard = useMemo(() => CardRenderers[type], [type])

	return <RenderCard id={id} card={card} navigateTo={navigateTo} onDelete={onDelete} onReorder={onReorder} />
}

export default memo(CanvasItem)
