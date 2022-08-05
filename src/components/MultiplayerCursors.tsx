import Cursor from './Cursor'
import { FC, memo, RefObject } from 'react'
import { useOthers } from '@/lib/liveblocks'
import { CURSOR_COLORS, CURSOR_NAMES } from '@/lib/consts'
import useTrackCursor from '@/hooks/canvas/useTrackCursor'

const MultiplayerCursors: FC<{ canvas: RefObject<HTMLDivElement> }> = ({ canvas }) => {
	useTrackCursor(canvas)
	const others = useOthers()

	if (!others) return null

	return (
		<>
			{others.map(({ connectionId, presence, info }) => {
				if (!presence || !presence.cursor) return

				return (
					<Cursor
						name={info?.name}
						key={connectionId}
						pos={presence.cursor}
						avatar={info?.avatar}
						emoji={CURSOR_NAMES[connectionId % CURSOR_NAMES.length]}
						color={CURSOR_COLORS[connectionId % CURSOR_COLORS.length]}
					/>
				)
			})}
		</>
	)
}

export default memo(MultiplayerCursors)
