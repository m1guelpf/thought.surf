import { JSONContent } from '@tiptap/react'
import { LiveList } from '@liveblocks/client'
import { CardCollection } from '@/types/cards'

export const APP_NAME = 'Infinite'
export const APP_HOST = process.env.NODE_ENV == 'production' ? '.infinite.camp' : 'localhost'

export const CURSOR_COLORS = ['#DC2626', '#D97706', '#059669', '#7C3AED', '#DB2777']
export const CURSOR_NAMES = ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐸', '🐷', '🐵', '🦄', '🦀', '🐝']

export const DEFAULT_ROOM_CONTENT: CardCollection = new LiveList()

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
	TWEET_URL: /twitter\.com\/\w+\/status(?:es)?\/\d+/,
	URL: /^(?:https?:\/\/.)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b[-a-zA-Z0-9@:%_\+.~#?&//=]*$/,
}

export const IMAGE_TYPES = ['image/gif', 'image/jpg', 'image/jpeg', 'image/png', 'image/webp']
export const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm']
export const OTHER_TYPES = ['application/pdf']
export const MIME_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES, ...OTHER_TYPES]

export const uriExpandBlacklist = ['giphy.com/', 'twitter.com/']
