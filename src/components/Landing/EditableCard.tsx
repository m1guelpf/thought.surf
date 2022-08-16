import TipTap from '../TipTap'
import FileCard from './FileCard'
import { Point } from 'framer-motion'
import { JSONContent } from '@tiptap/react'
import useDebugLog from '@/hooks/useDebugLog'
import { FC, memo, PropsWithChildren, RefObject, useState } from 'react'

type Props = PropsWithChildren<{
	title: string
	initialPos: Point
	content: JSONContent
	containerRef: RefObject<HTMLDivElement>
}>

const EditableCard: FC<Props> = ({ content, containerRef, title, initialPos, children }) => {
	const [doc, setDoc] = useState(content)

	useDebugLog(() => ({ doc }), title, [doc])

	return (
		<FileCard
			title={title}
			initialPos={initialPos}
			containerRef={containerRef}
			className="relative flex-1 py-3 px-6"
		>
			<div className="max-w-[18rem] md:max-w-md text-sm md:text-lg">
				<TipTap
					doc={doc}
					setDoc={setDoc}
					proseClassName="prose dark:prose-invert prose-lg h-full !max-w-full focus:outline-none min-h-[135px] cursor-text"
				/>
			</div>
			{children}
		</FileCard>
	)
}

export default memo(EditableCard)
