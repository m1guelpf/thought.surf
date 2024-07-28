import { Card } from '@/types/cards'
import { useMutation } from '@liveblocks/react'
import { LiveObject } from '@liveblocks/client'

export const useAddCard = () =>
	useMutation(({ storage }, card: Card) => {
		storage.get('cards').insert(new LiveObject(card), 0)
	}, [])

export const useUpdateCard = cardId =>
	useMutation(
		({ storage }, card: Partial<Card> | ((card: Card) => Partial<Card>)) => {
			const cards = storage.get('cards')
			console.log(cards.toArray())
			const liveCard = cards.find(card => card.get('id') === cardId)
			if (!liveCard) return

			liveCard.update(card instanceof Function ? card(liveCard.toObject()) : card)
		},
		[cardId]
	)

export const useDeleteCard = cardId =>
	useMutation(({ storage }) => {
		const cards = storage.get('cards')
		const cardIndex = cards.findIndex(card => card.get('id') === cardId)
		if (cardIndex === -1) return

		cards.delete(cardIndex)
	}, [])

export const useReorderCard = cardId =>
	useMutation(({ storage }) => {
		const cards = storage.get('cards')
		const cardIndex = cards.findIndex(card => card.get('id') === cardId)
		if (cardIndex == 0 || cardIndex == -1) return

		cards.move(cardIndex, 0)
	}, [])
