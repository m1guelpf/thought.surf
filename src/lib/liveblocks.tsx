import { Card } from '@/types/cards'
import { Point } from '@/types/canvas'
import { FC, PropsWithChildren } from 'react'
import { createRoomContext } from '@liveblocks/react'
import { createClient, LiveMap, LiveObject } from '@liveblocks/client'

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

export const LiveProvider: FC<PropsWithChildren<{ roomId: string }>> = ({ children, roomId }) => (
	<RoomProvider id={roomId} initialStorage={{ items: new LiveMap() }}>
		{children}
	</RoomProvider>
)
