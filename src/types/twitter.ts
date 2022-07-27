type URLEntity = {
	url: string
	expanded_url: string
	display_url: string
}

type MediaEntity = {
	media_url_https: string
	display_url: string
	type: 'photo' | 'video'
	url: string
	sizes: {
		large: {
			w: number
			h: number
			resize: 'fit' | 'crop'
		}
	}
	video_info?: {
		variants: Array<{
			content_type: string
			url: string
			bitrate: number
		}>
	}
}

export type TweetDetails = {
	created_at: string
	id_str: string
	full_text: string
	entities: {
		hashtags: []
		symbols: []
		user_mentions: Array<{
			screen_name: string
			name: string
		}>
		urls: URLEntity[]
		media?: Array<MediaEntity>
	}
	extended_entities?: {
		media: MediaEntity[]
	}
	in_reply_to_status_id_str: string | null
	in_reply_to_screen_name: string | null
	user: {
		name: string
		screen_name: string
		description: string
		url: string | null
		entities: {
			url?: {
				urls: [URLEntity]
			}
			description: {
				urls: URLEntity[]
			}
		}
		protected: boolean
		verified: boolean
		profile_image_url_https: string
	}
	is_quote_status: boolean
	quoted_status_id_str?: string
	quoted_status_permalink?: {
		url: string
		display: string
	}
	quoted_status?: TweetDetails
	retweet_count: number
	favorite_count: number
}
