import Image from 'next/image'
import FileCard from './FileCard'
import { Point } from 'framer-motion'
import { APP_NAME } from '@/lib/consts'
import partyParrot from '@images/parrot.gif'
import { RandomCursors } from './RandomCursor'
import { FC, PropsWithChildren, RefObject } from 'react'

type Props = PropsWithChildren<{
	initialPos: Point
	containerRef: RefObject<HTMLDivElement>
}>

const MultiplayerCard: FC<Props> = ({ containerRef, initialPos }) => {
	return (
		<FileCard
			title="Multiplayer_Fun.md"
			className="relative flex-1 py-3 px-6"
			initialPos={initialPos}
			containerRef={containerRef}
		>
			<div className="max-w-[18rem] md:max-w-md text-sm md:text-lg">
				<p className="text-2xl font-medium mb-3"># Aren&apos;t things better with frens?</p>
				<p className="text-lg ">
					<span className="font-medium text-purple-500">{APP_NAME}</span> natively supports multiplayer, so
					you can jam on ideas with your favourite people.
				</p>
			</div>
			<div className="mt-4 relative h-24 group">
				<RandomCursors render={4} />
				<span className="absolute inset-0 flex items-center justify-center text-gray-300 group-hover:opacity-0 transition-opacity duration-300">
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
		</FileCard>
	)
}

export default MultiplayerCard
