import { Point } from '@/types/canvas'
import { createClient } from '@liveblocks/client'
import { createRoomContext } from '@liveblocks/react'

export type Presence = {
	cursor: Point | null
	selectedItem: string | null
}

const client = createClient({
	publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_KEY,
})

export const { RoomProvider, useOthers, useUpdateMyPresence, useMap, useHistory, useRoom, useBatch } =
	createRoomContext(client)
