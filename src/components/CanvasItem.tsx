import URLCard from './Cards/URLCard'
import TextCard from './Cards/TextCard'
import FileCard from './Cards/FileCard'
import TweetCard from './Cards/TweetCard'
import { Card, CardType } from '@/types/cards'
import useCamera, { CameraStore } from '@/store/camera'
import { useCallback, memo, FC, useRef, useMemo, MutableRefObject } from 'react'

const CardRenderers: Record<
	string,
	FC<{
		id: string
		card: Card
		navigateTo: () => void
		containerRef: MutableRefObject<HTMLDivElement>
	}>
> = {
	[CardType.URL]: URLCard,
	[CardType.TEXT]: TextCard,
	[CardType.FILE]: FileCard,
	[CardType.TWEET]: TweetCard,
}

const getParams = (store: CameraStore) => ({ zoomOn: store.zoomOnPoint, setTransition: store.setTransitioning })

type Props = {
	id: string
	card: Card
}

const CanvasItem: FC<Props> = ({ id, card }) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const { zoomOn, setTransition } = useCamera(getParams)

	const navigateTo = useCallback(() => {
		const rect = containerRef.current.getBoundingClientRect()

		setTransition(true)
		zoomOn(card.point, { width: rect.width, height: rect.height })
	}, [card, zoomOn, setTransition])

	const RenderCard = useMemo(() => CardRenderers[card.type], [card.type])

	return <RenderCard id={id} card={card} navigateTo={navigateTo} containerRef={containerRef} />
}

export default memo(CanvasItem)
