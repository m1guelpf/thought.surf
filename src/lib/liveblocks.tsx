import { Point } from '@/types/canvas'
import useCamera from '../store/camera'
import { CardCollection } from '@/types/cards'
import { DEFAULT_ROOM_CONTENT } from './consts'
import { createClient } from '@liveblocks/client'
import { createRoomContext } from '@liveblocks/react'
import { FC, PropsWithChildren, useEffect, useState } from 'react'

type ConnectionState = 'closed' | 'authenticating' | 'unavailable' | 'failed' | 'open' | 'connecting'

type Presence = {
	cursor: Point | null
	selectedItem: string | null
}

type Storage = {
	items: CardCollection
}

type UserMeta = {}

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

export const { RoomProvider, useOthers, useUpdateMyPresence, useMap, useHistory, useRoom, useBatch } =
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
		<RoomProvider id={roomId} initialStorage={{ items: DEFAULT_ROOM_CONTENT }}>
			<RoomStateWatcher state={state} setState={setState} />
			{children}
		</RoomProvider>
	)
}

export const RoomStateWatcher = ({ state, setState }) => {
	const room = useRoom()

	useEffect(() => {
		const checkState = (state, newState) => {
			if (state == newState) return

			setState(newState)
		}

		const interval = setInterval(() => checkState(state, room.getConnectionState()), 1000)

		return () => {
			clearInterval(interval)
		}
	})

	return null
}
