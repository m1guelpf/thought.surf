import { Editor } from '@tiptap/react'
import BoldIcon from './Icons/BoldIcon'
import ItalicIcon from './Icons/ItalicIcon'
import StrikethroughIcon from './Icons/StrikethroughIcon'

export const TipTapMenu = ({ editor, className }: { editor: Editor; className?: string }) => {
	if (!editor) return

	return (
		<div className={className}>
			<MenuItem
				icon={BoldIcon}
				isActive={editor.isActive('bold')}
				onClick={() => editor.chain().focus().toggleBold().run()}
			/>
			<MenuItem
				icon={ItalicIcon}
				isActive={editor.isActive('italic')}
				onClick={() => editor.chain().focus().toggleItalic().run()}
			/>
			<MenuItem
				icon={StrikethroughIcon}
				isActive={editor.isActive('strike')}
				onClick={() => editor.chain().focus().toggleStrike().run()}
			/>
		</div>
	)
}

const MenuItem = ({ onClick, isActive, icon: Icon }) => {
	return (
		<button
			onClick={onClick}
			className={`rounded p-1 transition ${
				isActive ? 'bg-black/80 dark:bg-white/30' : 'hover:bg-black/5 hover:dark:bg-white/20'
			}`}
		>
			<Icon
				className={`w-4 h-4 ${isActive ? 'text-white dark:text-white/80' : 'text-black dark:text-white/80'}`}
			/>
		</button>
	)
}
