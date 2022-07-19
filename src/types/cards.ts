import { Point, Size } from './canvas'
import { Json } from '@liveblocks/client'
import { JSONContent } from '@tiptap/react'

export enum CardType {
	TEXT = 'text',
	EMPTY = 'empty',
}

export type Card<T extends Record<string, Json> = Record<string, Json>> = {
	point: Point
	size: Size
	type: CardType
	attributes?: T
}

export type CardOptions = {
	resizeAxis: { x: boolean; y: boolean }
}

export type TextCard = Card<{
	doc: JSONContent
}>
