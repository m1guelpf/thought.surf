import Cursor from './Cursor'
import { FC, memo, RefObject } from 'react'
import { CURSOR_COLORS } from '@/lib/consts'
import { useOthers } from '@/lib/liveblocks'
import useTrackCursor from '@/hooks/canvas/useTrackCursor'

const MultiplayerCursors: FC<{ canvas: RefObject<HTMLDivElement> }> = ({ canvas }) => {
	useTrackCursor(canvas)
	const others = useOthers()

	if (!others) return null

	return (
		<>
			{others.map(({ connectionId, presence }) => {
				if (!presence || !presence.cursor) return

				return (
					<Cursor
						key={connectionId}
						pos={presence.cursor}
						color={CURSOR_COLORS[connectionId % CURSOR_COLORS.length]}
					/>
				)
			})}
		</>
	)
}

export default memo(MultiplayerCursors)
