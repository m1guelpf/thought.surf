import { Point } from '@/types/canvas'
import useCamera from '../store/camera'
import { CardCollection } from '@/types/cards'
import { createClient } from '@liveblocks/client'
import { createRoomContext } from '@liveblocks/react'
import { APP_URL, DEFAULT_ROOM_CONTENT } from './consts'
import { FC, PropsWithChildren, useEffect, useState } from 'react'

type ConnectionState = 'closed' | 'authenticating' | 'unavailable' | 'failed' | 'open' | 'connecting'

type Presence = {
	cursor: Point | null
	selectedCard: string | null
}

type Storage = {
	cards: CardCollection
}

type UserMeta = {
	id: string
	info: {
		name?: string
		avatar?: string
	}
}

export const client = createClient({
	authEndpoint: async room => {
		const response = await fetch('/api/auth', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ room }),
		})

		return response.json()
	},
})

export const { RoomProvider, useOthers, useUpdateMyPresence, useList, useHistory, useRoom, useBatch } =
	createRoomContext<Presence, Storage, UserMeta>(client)

export const LiveProvider: FC<PropsWithChildren<{ roomId: string; onAuthFailure?: () => void }>> = ({
	roomId,
	children,
	onAuthFailure,
}) => {
	const [state, setState] = useState<ConnectionState>(null)

	useEffect(() => {
		if (!roomId) return

		useCamera.persist.setOptions({ name: `camera-${roomId}` })
		useCamera.persist.rehydrate()
	}, [roomId])

	useEffect(() => {
		if (state != 'unavailable') return

		onAuthFailure && onAuthFailure()
	}, [state, onAuthFailure])

	return (
		<RoomProvider id={roomId} initialStorage={{ cards: DEFAULT_ROOM_CONTENT }}>
			<RoomStateWatcher state={state} setState={setState} />
			{children}
		</RoomProvider>
	)
}

export const RoomStateWatcher = ({ state, setState }) => {
	const room = useRoom()

	useEffect(() => {
		const unsubscribe = room.subscribe('connection', setState)

		return unsubscribe
	})

	return null
}
