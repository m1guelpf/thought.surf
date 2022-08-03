import { Menu } from './right-click'
import { Point, Size } from './canvas'
import { JSONContent } from '@tiptap/react'
import { Json, LiveMap, LiveObject } from '@liveblocks/client'

export enum CardType {
	URL = 'url',
	TEXT = 'text',
	TWEET = 'tweet',
}

export type CardCollection = LiveMap<string, LiveObject<Card>>

export type Card<T extends Record<string, Json> = Record<string, Json>> = {
	point: Point
	size: Size
	type: CardType
	attributes?: T
	headerPinned?: boolean
}

export type CardOptions = {
	menuItems?: Menu
	resizeAxis: { x: boolean; y: boolean }
}

export type TextCard = Card<{
	doc: JSONContent
	title: string
}>

export type URLCard = Card<{
	url: string
	isLive: boolean
}>
