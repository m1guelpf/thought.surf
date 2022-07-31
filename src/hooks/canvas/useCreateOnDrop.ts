import { randomId } from '@/lib/utils'
import { useMap } from '@/lib/liveblocks'
import { useCallback, useEffect } from 'react'
import { LiveObject } from '@liveblocks/client'
import { eventAlreadyHandled } from '@/lib/canvas'
import { useCamera } from '@/context/CanvasContext'
import { cardFromDrag, getTextCards } from '@/lib/cards'

const useCreateOnDrop = () => {
	const items = useMap('items')
	const { camera } = useCamera()

	const onDrop = useCallback(
		(event: DragEvent) => {
			if (eventAlreadyHandled(event)) return
			event.preventDefault()

			const cards = cardFromDrag(
				event,
				camera,
				getTextCards(items).map(({ attributes: { title } }) => title)
			)

			cards.forEach(card => items.set(randomId(), new LiveObject(card)))
		},
		[items]
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
