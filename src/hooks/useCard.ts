import { useRoom } from '@/lib/liveblocks'
import { useEffect, useState } from 'react'
import { LiveObject, LsonObject } from '@liveblocks/client'

const useCard = <T extends LsonObject>(card: LiveObject<T>): T => {
	const room = useRoom()
	const [_card, setCard] = useState(card.toObject())

	useEffect(() => {
		function onChange() {
			setCard(card.toObject())
		}

		return room.subscribe(card, onChange)
	}, [room, card])

	return _card
}

export default useCard
