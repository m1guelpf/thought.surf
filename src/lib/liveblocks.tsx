import { Card } from '@/types/cards'
import { Point } from '@/types/canvas'
import { FC, PropsWithChildren } from 'react'
import { useRoomId } from '@/context/CanvasContext'
import { createRoomContext } from '@liveblocks/react'
import { createClient, LiveMap, LiveObject } from '@liveblocks/client'

type Presence = {
	cursor: Point | null
	selectedItem: string | null
}

type Storage = {
	items: LiveMap<string, LiveObject<Card>>
}

const client = createClient({
	publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_KEY,
})

export const { RoomProvider, useOthers, useUpdateMyPresence, useMap, useHistory, useRoom, useBatch } =
	createRoomContext<Presence, Storage>(client)

export const LiveProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	const { roomId } = useRoomId()

	return (
		<RoomProvider id={roomId} initialStorage={{ items: new LiveMap() }}>
			{children}
		</RoomProvider>
	)
}
