import { useAddCard } from '../useCard'
import { useRefCamera } from '@/store/camera'
import { useCallback, useEffect } from 'react'
import { eventAlreadyHandled } from '@/lib/canvas'
import { cardFromDrag, getNamedCards } from '@/lib/cards'
import { useStorage, useMutation } from '@liveblocks/react'

const useCreateOnDrop = () => {
	const camera = useRefCamera()
	const createCard = useAddCard()
	const cards = useStorage(root => root.cards)

	const onDrop = useCallback(
		async (event: DragEvent) => {
			if (eventAlreadyHandled(event)) return
			event.preventDefault()

			const addCards = await cardFromDrag(
				event,
				camera.current,
				getNamedCards(cards).map(({ attributes: { title } }) => title)
			)

			addCards.forEach(card => createCard(card))
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[cards]
	)

	useEffect(() => {
		const onDragOver = event => event.preventDefault()

		document.body.addEventListener('drop', onDrop)
		document.body.addEventListener('dragover', onDragOver)

		return () => {
			document.body.removeEventListener('drop', onDrop)
			document.body.removeEventListener('dragover', onDragOver)
		}
	})
}

export default useCreateOnDrop
