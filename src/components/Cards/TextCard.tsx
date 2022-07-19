import { Camera } from '@/types/canvas'
import { useRoom } from '@/lib/liveblocks'
import useMeasure from '@/hooks/useMeasure'
import { DEFAULT_TEXT } from '@/lib/consts'
import StarterKit from '@tiptap/starter-kit'
import { screenToCanvas } from '@/lib/canvas'
import { LiveObject } from '@liveblocks/client'
import { FC, memo, useEffect, useState } from 'react'
import Placeholder from '@tiptap/extension-placeholder'
import { useEditor, EditorContent } from '@tiptap/react'
import { CardOptions, CardType, TextCard } from '@/types/cards'

export const textCardOptions: CardOptions = {
	resizeAxis: { x: true, y: false },
}

const TextCard: FC<{ item: LiveObject<TextCard>; id: string }> = ({ item }) => {
	const room = useRoom()
	const [measureRef, { height }] = useMeasure<HTMLDivElement>()
	const [
		{
			attributes: { doc },
		},
		setItem,
	] = useState(item.toObject())

	useEffect(() => {
		function onChange() {
			setItem(item.toObject())
		}

		return room.subscribe(item, onChange)
	}, [room, item])

	useEffect(() => {
		const { width } = item.get('size')

		item.set('size', { width, height: height + 20 })
	}, [item, height])

	const editor = useEditor({
		editorProps: {
			attributes: {
				class: 'prose dark:prose-invert prose-lg xl:prose-2xl h-full !max-w-full focus:outline-none min-h-[135px] cursor-text border-2 border-black/0 dark:border-white/0 focus:border-black/10 dark:focus:border-white/20 rounded-lg p-5 transition z-10',
			},
		},
		content: doc,
		onUpdate: ({ editor }) => {
			item.set('attributes', { doc: editor.getJSON() })
		},
		extensions: [Placeholder.configure({ placeholder: "What's on your mind?" }), StarterKit],
	})

	useEffect(() => {
		if (!editor) return

		try {
			const selection = editor.state.selection
			editor.commands.setContent(doc)
			editor.commands.setTextSelection(selection)
		} catch {
			console.log('error updating TipTap content')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [doc])

	return (
		<div className="w-full" ref={measureRef}>
			<EditorContent className="bg-black/[.01] dark:bg-black/80 rounded-lg" editor={editor} />
		</div>
	)
}

export const createTextCard = (camera: Camera): TextCard => ({
	point: screenToCanvas({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, camera),
	size: { width: 500, height: 500 },
	type: CardType.TEXT,
	attributes: { doc: DEFAULT_TEXT },
})

export default memo(TextCard)
