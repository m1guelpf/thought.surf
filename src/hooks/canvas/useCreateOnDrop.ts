import { useRefCamera } from '@/store/camera'
import { useCallback, useEffect } from 'react'
import { LiveObject } from '@liveblocks/client'
import { eventAlreadyHandled } from '@/lib/canvas'
import { useBatch, useList } from '@/lib/liveblocks'
import { cardFromDrag, getNamedCards } from '@/lib/cards'

const useCreateOnDrop = () => {
	const batch = useBatch()
	const cards = useList('cards')
	const camera = useRefCamera()

	const onDrop = useCallback(
		async (event: DragEvent) => {
			if (eventAlreadyHandled(event)) return
			event.preventDefault()

			const addCards = await cardFromDrag(
				event,
				camera.current,
				getNamedCards(cards).map(({ attributes: { title } }) => title)
			)

			batch(() => addCards.forEach(card => cards.insert(new LiveObject(card), 0)))
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[cards]
	)

	const onDragOver = event => event.preventDefault()

	useEffect(() => {
		document.body.addEventListener('drop', onDrop)
		document.body.addEventListener('dragover', onDragOver)

		return () => {
			document.body.removeEventListener('drop', onDrop)
			document.body.removeEventListener('dragover', onDragOver)
		}
	})
}

export default useCreateOnDrop
