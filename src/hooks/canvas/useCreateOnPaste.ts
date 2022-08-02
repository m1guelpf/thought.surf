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
		document.addEventListener('paste', onPaste)

		return () => {
			document.removeEventListener('paste', onPaste)
		}
	})
}

export default useCreateOnPaste
