import { Point } from './canvas'
import { CardCollection } from './cards'

declare global {
	interface Liveblocks {
		Presence: {
			cursor: Point | null
			selectedCard: string | null
		}

		Storage: {
			cards: CardCollection
		}

		UserMeta: {
			id: string
			info: {
				name?: string
				avatar?: string
			}
		}
	}
}

export {}
