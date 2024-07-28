import { useAddCard } from '../useCard'
import { useRefCamera } from '@/store/camera'
import { useCallback, useEffect } from 'react'
import { cardFromPaste, getNamedCards } from '@/lib/cards'
import { useMutation, useStorage } from '@liveblocks/react'

const useCreateOnPaste = () => {
	const addCard = useAddCard()
	const camera = useRefCamera()
	const cards = useStorage(root => root.cards)

	const onPaste = useCallback(
		async (event: ClipboardEvent) => {
			addCard(
				await cardFromPaste(
					event,
					camera.current,
					getNamedCards(cards).map(({ attributes: { title } }) => title)
				)
			)
		},
		[cards, camera]
	)

	useEffect(() => {
		window.addEventListener('paste', onPaste)

		return () => {
			window.removeEventListener('paste', onPaste)
		}
	})
}

export default useCreateOnPaste
