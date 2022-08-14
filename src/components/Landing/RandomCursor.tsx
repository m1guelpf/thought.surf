import { randomNum } from '@/lib/utils'
import { PerfectCursor } from 'perfect-cursors'
import avatar3 from '@images/avatars/ruedart.jpg'
import avatar4 from '@images/avatars/punk4156.jpg'
import avatar1 from '@images/avatars/m1guelpf.jpg'
import avatar2 from '@images/avatars/sadlyoddisfying.jpg'
import { CURSOR_COLORS, CURSOR_NAMES } from '@/lib/consts'
import { FC, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'

const CURSOR_AVATARS: string[] = [avatar1.src, avatar2.src, avatar3.src, avatar4.src]

type Props = {
	avatar?: string
}

// hack to get sequential instance IDs
let cursorInstances = 0

const RandomCursor: FC<Props> = ({}) => {
	const [i] = useState(() => cursorInstances++)
	const rCursor = useRef<HTMLDivElement>(null)

	const [pc] = useState(
		() =>
			new PerfectCursor((point: number[]) => {
				if (!rCursor.current) return

				rCursor.current.style.top = `${point[0]}%`
				rCursor.current.style.left = `${point[1]}%`
			})
	)

	useLayoutEffect(() => {
		const interval = setInterval(() => {
			pc.addPoint([randomNum(0, 80), randomNum(0, 80)])
			if (rCursor.current.style.top) rCursor.current.style.opacity = '1'
		}, 1000 + i * randomNum(100, 500))

		return () => {
			pc.dispose()
			clearInterval(interval)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div
			ref={rCursor}
			style={{ backgroundColor: CURSOR_COLORS[i % CURSOR_COLORS.length], opacity: 0 }}
			className="absolute pointer-events-none top-0 left-0 w-14 h-14 z-20 overflow-hidden rounded-full rounded-tl-none flex items-center justify-center transition-opacity"
		>
			<Avatar>
				<AvatarImage src={CURSOR_AVATARS?.[i]} alt="" className="w-full h-full" />
				<AvatarFallback>
					<p className={`leading-relaxed text-white text-2xl whitespace-nowrap uppercase`}>
						{CURSOR_NAMES[i]}
					</p>
				</AvatarFallback>
			</Avatar>
		</div>
	)
}

export const RandomCursors: FC<{ render: number }> = ({ render }) => {
	const cursors = useMemo(() => [...Array(render).keys()], [render])

	return (
		<>
			{cursors.map(i => (
				<RandomCursor key={i} />
			))}
		</>
	)
}

export default RandomCursor
