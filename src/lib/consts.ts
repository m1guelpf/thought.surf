import { Card } from '@/types/cards'
import { JSONContent } from '@tiptap/react'
import { LiveMap, LiveObject } from '@liveblocks/client'

export const APP_NAME = 'Infinite'

export const CURSOR_COLORS = ['#DC2626', '#D97706', '#059669', '#7C3AED', '#DB2777']

export const DEFAULT_ROOM_CONTENT: LiveMap<string, LiveObject<Card>> = new LiveMap()

export const DEFAULT_TEXT: JSONContent = {
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'What are you thinking about?',
				},
			],
		},
	],
}

export const REGEX = {
	URL: /^(?:https?:\/\/.)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b[-a-zA-Z0-9@:%_\+.~#?&//=]*$/,
	TWEET_URL: /twitter\.com\/\w+\/status(?:es)?\/\d+/,
}

export const uriExpandBlacklist = ['giphy.com/', 'twitter.com/']
