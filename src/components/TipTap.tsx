import { Link } from '@/lib/tiptap/Link'
import { TipTapMenu } from './TipTapMenu'
import StarterKit from '@tiptap/starter-kit'
import { FC, memo, RefObject, useEffect } from 'react'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, JSONContent, useEditor } from '@tiptap/react'

const TipTap: FC<{
	className?: string
	renderMenu?: RefObject<HTMLDivElement>
	editorClassName?: string
	doc: JSONContent
	setDoc: (doc: JSONContent) => void
}> = ({ className = '', editorClassName = '', doc, setDoc, renderMenu }) => {
	const editor = useEditor({
		editorProps: {
			attributes: {
				class: 'prose dark:prose-invert prose-lg xl:prose-2xl h-full !max-w-full focus:outline-none min-h-[135px] cursor-text border-2 border-black/0 dark:border-white/0 focus:border-black/10 dark:focus:border-white/20 rounded-lg p-5 transition duration-300 z-10',
			},
		},
		content: doc,
		onUpdate: ({ editor }) => {
			setDoc(editor.getJSON())
		},
		extensions: [
			Link.configure({ HTMLAttributes: { target: '_blank' } }),
			Placeholder.configure({ placeholder: "What's on your mind?" }),
			StarterKit,
		],
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
		<div className={className}>
			<TipTapMenu renderAt={renderMenu} editor={editor} />
			<EditorContent className={editorClassName} editor={editor} />
		</div>
	)
}

export default memo(TipTap)
