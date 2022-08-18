import { useList } from '@/lib/liveblocks'
import { useRefCamera } from '@/store/camera'
import { useCallback, useEffect } from 'react'
import { LiveObject } from '@liveblocks/client'
import { cardFromPaste, getNamedCards } from '@/lib/cards'

const useCreateOnPaste = () => {
	const cards = useList('cards')
	const camera = useRefCamera()

	const onPaste = useCallback(
		async (event: ClipboardEvent) => {
			cards.insert(
				new LiveObject(
					await cardFromPaste(
						event,
						camera.current,
						getNamedCards(cards).map(({ attributes: { title } }) => title)
					)
				),
				0
			)
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[cards]
	)

	useEffect(() => {
		window.addEventListener('paste', onPaste)

		return () => {
			window.removeEventListener('paste', onPaste)
		}
	})
}

export default useCreateOnPaste
