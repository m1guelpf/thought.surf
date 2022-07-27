import { JSONContent } from '@tiptap/react'

export const APP_NAME = 'Infinite'

export const CURSOR_COLORS = ['#DC2626', '#D97706', '#059669', '#7C3AED', '#DB2777']

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
}

export const uriExpandBlacklist = ['giphy.com/', 'twitter.com/']
