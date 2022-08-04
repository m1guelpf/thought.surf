import { Editor } from '@tiptap/react'
import { memo, RefObject } from 'react'
import BoldIcon from './Icons/BoldIcon'
import { createPortal } from 'react-dom'
import { classNames } from '@/lib/utils'
import ItalicIcon from './Icons/ItalicIcon'
import { LinkIcon } from '@heroicons/react/solid'
import StrikethroughIcon from './Icons/StrikethroughIcon'

export const TipTapMenu = ({ editor, renderAt }: { editor: Editor; renderAt: RefObject<HTMLDivElement> }) => {
	if (!editor) return

	return createPortal(
		<>
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
			<MenuItem
				icon={LinkIcon}
				isActive={editor.isActive('link')}
				onClick={() =>
					editor.isActive('link')
						? editor.chain().focus().unsetLink().run()
						: editor
								.chain()
								.focus()
								.toggleLink({ href: prompt('What URL should the text link to?') })
								.run()
				}
			/>
		</>,
		renderAt.current
	)
}

const MenuItem = ({ onClick, isActive, icon: Icon }) => {
	return (
		<button
			onClick={onClick}
			className={classNames(
				isActive
					? 'opacity-100 bg-gray-400/60 dark:bg-gray-400/60'
					: 'opacity-60 hover:opacity-80 bg-gray-200/60 dark:bg-gray-700/60',
				`rounded p-1 opacity-60 transition`
			)}
		>
			<Icon className="w-5 h-5" />
		</button>
	)
}

export default memo(TipTapMenu)
