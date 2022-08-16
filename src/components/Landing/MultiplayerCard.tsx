import Image from 'next/image'
import FileCard from './FileCard'
import { Point } from 'framer-motion'
import { APP_NAME } from '@/lib/consts'
import EditableCard from './EditableCard'
import { JSONContent } from '@tiptap/react'
import partyParrot from '@images/parrot.gif'
import { RandomCursors } from './RandomCursor'
import { FC, memo, PropsWithChildren, RefObject } from 'react'
import { buildDoc, buildHeading, buildParagraph, buildText } from '@/lib/tiptap/builder'

type Props = PropsWithChildren<{
	initialPos: Point
	containerRef: RefObject<HTMLDivElement>
}>

const cardDoc: JSONContent = buildDoc([
	buildHeading("# Aren't things better with frens?", 3),
	buildParagraph([
		buildText(APP_NAME, { color: '#a855f7', 'font-weight': '500' }),
		' natively supports multiplayer, so you can jam on ideas with your favourite people.',
	]),
])

const MultiplayerCard: FC<Props> = ({ containerRef, initialPos }) => {
	return (
		<EditableCard content={cardDoc} title="Multiplayer_Fun.md" initialPos={initialPos} containerRef={containerRef}>
			<div className="mt-4 relative h-24 group">
				<RandomCursors render={4} />
				<span className="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-gray-700 group-hover:opacity-0 transition-opacity duration-300">
					(hover me)
				</span>
				<div className="mt-4 flex h-full items-center justify-center border-4 border-indigo-500 group-hover:animate-rainbow-colors border-dashed opacity-40 group-hover:opacity-100 transition-all duration-300 filter blur-md group-hover:blur-0">
					<div className="flex items-baseline !space-x-2">
						<Image
							className="opacity-0 group-hover:opacity-100 transition duration-300"
							width={40}
							height={40}
							src={partyParrot}
							alt=""
						/>
						<p className="transform -translate-y-2 font-mono text-lg">cursor party!!</p>
						<Image
							className="opacity-0 group-hover:opacity-100 transition duration-300"
							width={40}
							height={40}
							src={partyParrot}
							alt=""
						/>
					</div>
				</div>
			</div>
		</EditableCard>
	)
}

export default memo(MultiplayerCard)
