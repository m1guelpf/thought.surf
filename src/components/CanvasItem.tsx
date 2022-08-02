import useItem from '@/hooks/useItem'
import URLCard from './Cards/URLCard'
import TextCard from './Cards/TextCard'
import TweetCard from './Cards/TweetCard'
import { Card, CardType } from '@/types/cards'
import { LiveObject } from '@liveblocks/client'
import { useCallback, memo, FC, useRef, useMemo } from 'react'
import useCamera, { shallow, CameraStore } from '@/store/camera'

const CardRenderers: Record<
	string,
	FC<{ id: string; item: LiveObject<Card>; navigateTo: () => void; onDelete: () => void }>
> = {
	[CardType.URL]: URLCard,
	[CardType.TEXT]: TextCard,
	[CardType.TWEET]: TweetCard,
}

const getParams = (store: CameraStore) => ({ zoomOn: store.zoomOnPoint, setTransition: store.setTransitioning })

const CanvasItem: FC<{ id: string; item: LiveObject<Card>; removeCard: (id: string) => unknown }> = ({
	id,
	item,
	removeCard,
}) => {
	const { type } = useItem(item)
	const containerRef = useRef<HTMLDivElement>(null)
	const { zoomOn, setTransition } = useCamera(getParams, shallow)
	const onDelete = useCallback(() => removeCard(id), [id, removeCard])

	const navigateTo = useCallback(() => {
		const rect = containerRef.current.getBoundingClientRect()

		setTransition(true)
		zoomOn(item.get('point'), { width: rect.width, height: rect.height })
	}, [item, zoomOn, setTransition])

	const RenderCard = useMemo(() => CardRenderers[type], [type])

	return <RenderCard id={id} item={item} navigateTo={navigateTo} onDelete={onDelete} />
}

export default memo(CanvasItem)
