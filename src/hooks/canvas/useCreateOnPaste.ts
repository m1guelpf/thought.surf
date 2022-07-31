import { randomId } from '@/lib/utils'
import { useMap } from '@/lib/liveblocks'
import { useCallback, useEffect } from 'react'
import { LiveObject } from '@liveblocks/client'
import { eventAlreadyHandled } from '@/lib/canvas'
import { useCamera } from '@/context/CanvasContext'
import { cardFromPaste, getTextCards } from '@/lib/cards'

const useCreateOnPaste = () => {
	const items = useMap('items')
	const { camera } = useCamera()

	const onPaste = useCallback(
		(event: ClipboardEvent) => {
			if (eventAlreadyHandled(event)) return

			items.set(
				randomId(),
				new LiveObject(
					cardFromPaste(
						event,
						camera,
						getTextCards(items).map(({ attributes: { title } }) => title)
					)
				)
			)
		},
		[items]
	)

	useEffect(() => {
		document.addEventListener('paste', onPaste)

		return () => {
			document.removeEventListener('paste', onPaste)
		}
	})
}

export default useCreateOnPaste
