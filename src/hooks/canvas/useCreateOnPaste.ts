import { randomId } from '@/lib/utils'
import { useMap } from '@/lib/liveblocks'
import { cardFromPaste } from '@/lib/cards'
import { useCallback, useEffect } from 'react'
import { LiveObject } from '@liveblocks/client'
import { eventAlreadyHandled } from '@/lib/canvas'
import { useCamera } from '@/context/CanvasContext'

const useCreateOnPaste = () => {
	const items = useMap('items')
	const { camera } = useCamera()

	const onPaste = useCallback(
		(event: ClipboardEvent) => {
			if (eventAlreadyHandled(event)) return

			items.set(randomId(), new LiveObject(cardFromPaste(event, camera)))
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
