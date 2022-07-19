import { Card } from '@/types/cards'
import { Point } from '@/types/canvas'
import { createRoomContext } from '@liveblocks/react'
import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { createClient, LiveMap, LiveObject } from '@liveblocks/client'

type ConnectionState = 'closed' | 'authenticating' | 'unavailable' | 'failed' | 'open' | 'connecting'

type Presence = {
	cursor: Point | null
	selectedItem: string | null
}

type Storage = {
	items: LiveMap<string, LiveObject<Card>>
}

type UserMeta = {}

const client = createClient({
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
		if (state != 'unavailable') return

		onAuthFailure && onAuthFailure()
	}, [state, onAuthFailure])

	return (
		<RoomProvider id={roomId} initialStorage={{ items: new LiveMap() }}>
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
