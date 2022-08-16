import { Link } from '@/lib/tiptap/Link'
import { TipTapMenu } from './TipTapMenu'
import Color from '@tiptap/extension-color'
import StarterKit from '@tiptap/starter-kit'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { FontWeight } from '@/lib/tiptap/FontWeight'
import TextStyle from '@tiptap/extension-text-style'
import { FC, memo, RefObject, useEffect } from 'react'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, JSONContent, useEditor } from '@tiptap/react'

const DEFAULT_PROSE =
	'prose dark:prose-invert prose-lg xl:prose-2xl h-full !max-w-full focus:outline-none min-h-[135px] cursor-text border-2 border-black/0 dark:border-white/0 focus:border-black/10 dark:focus:border-white/20 rounded-lg p-5 transition duration-300 z-10'

type Props = {
	doc: JSONContent
	className?: string
	proseClassName?: string
	editorClassName?: string
	setDoc?: (doc: JSONContent) => void
	renderMenu?: RefObject<HTMLDivElement>
}

const TipTap: FC<Props> = ({
	doc,
	setDoc,
	renderMenu,
	className = '',
	editorClassName = '',
	proseClassName = DEFAULT_PROSE,
}) => {
	const editor = useEditor({
		content: doc,
		editorProps: { attributes: { class: proseClassName } },
		onUpdate: ({ editor }) => {
			setDoc && setDoc(editor.getJSON())
		},
		extensions: [
			Color,
			TextStyle,
			StarterKit,
			FontWeight,
			Link.configure({ HTMLAttributes: { target: '_blank' } }),
			TaskList.configure({ HTMLAttributes: { class: 'list-none' } }),
			Placeholder.configure({ placeholder: "What's on your mind?" }),
			TaskItem.configure({
				nested: true,
				HTMLAttributes: {
					class: 'flex [&_ul]:pl-6 [&_input]:text-black [&_input]:rounded [&_label]:-ml-6 [&_label]:mr-3 not-prose',
				},
			}),
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
		<div className={className} onPaste={event => event.stopPropagation()}>
			<TipTapMenu renderAt={renderMenu} editor={editor} />
			<EditorContent className={editorClassName} editor={editor} />
		</div>
	)
}

export default memo(TipTap)
