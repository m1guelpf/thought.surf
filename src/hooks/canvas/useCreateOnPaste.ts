import { randomId } from '@/lib/utils'
import { useMap } from '@/lib/liveblocks'
import { useRefCamera } from '@/store/camera'
import { useCallback, useEffect } from 'react'
import { LiveObject } from '@liveblocks/client'
import { eventAlreadyHandled } from '@/lib/canvas'
import { cardFromPaste, getTextCards } from '@/lib/cards'

const useCreateOnPaste = () => {
	const items = useMap('items')
	const camera = useRefCamera()

	const onPaste = useCallback(
		(event: ClipboardEvent) => {
			console.log(event.composedPath())
			items.set(
				randomId(),
				new LiveObject(
					cardFromPaste(
						event,
						camera.current,
						getTextCards(items).map(({ attributes: { title } }) => title)
					)
				)
			)
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[items]
	)

	useEffect(() => {
		window.addEventListener('paste', onPaste)

		return () => {
			window.removeEventListener('paste', onPaste)
		}
	})
}

export default useCreateOnPaste
