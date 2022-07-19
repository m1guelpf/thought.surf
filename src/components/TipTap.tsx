import { FC, useEffect } from 'react'
import { TipTapMenu } from './TipTapMenu'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, JSONContent, useEditor } from '@tiptap/react'

const TipTap: FC<{
	className?: string
	editorClassName?: string
	doc: JSONContent
	setDoc: (doc: JSONContent) => void
}> = ({ className = '', editorClassName = '', doc, setDoc }) => {
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
		<div className={className}>
			<TipTapMenu
				className="absolute top-0 left-0 inline-flex border-r-2 border-b-2 border-transparent dark:border-white/10 bg-white/30 dark:bg-black/30 backdrop-filter backdrop-blur-xl p-1 rounded-br opacity-0 group-hover:opacity-100 transition space-x-2 shadow z-30"
				editor={editor}
			/>
			<EditorContent className={editorClassName} editor={editor} />
		</div>
	)
}

export default TipTap
