import String from './string'
import { TweetDetails } from '@/types/twitter'

export const getText = (tweet: TweetDetails): String => {
	let text = new String(tweet.full_text)

	for (const image of tweet.entities.media ?? []) text = text.replaceAll(image.url, '')
	for (const link of tweet.entities?.urls || []) text = text.replaceAll(link.url, link.display_url)

	return text
		.replaceAll(tweet?.quoted_status_permalink?.url, '')
		.replaceAll(tweet?.quoted_status_permalink?.display, '')
}

export const getVideoSource = (media): string => {
	return (
		media.video_info.variants.find(variant => variant.content_type.includes('mpegURL'))?.url ??
		media.video_info.variants[0].url
	)
}

export const getShareUrl = (text: string, url?: string): string => {
	return `https://twitter.com/intent/tweet/?text=${encodeURIComponent(text)}${
		url ? `&url=${encodeURIComponent(url)}` : ''
	}`
}

export const clearURL = (url: string): string => url.split('?')[0]
