import { useRoom } from '@/lib/liveblocks'
import { useEffect, useState } from 'react'
import { LiveObject, LsonObject } from '@liveblocks/client'

const useItem = <T extends LsonObject>(item: LiveObject<T>): T => {
	const room = useRoom()
	const [_item, setItem] = useState(item.toObject())

	useEffect(() => {
		function onChange() {
			setItem(item.toObject())
		}

		return room.subscribe(item, onChange)
	}, [room, item])

	return _item
}

export default useItem
