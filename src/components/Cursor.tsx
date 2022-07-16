import { FC, useMemo } from 'react'
import { Point } from '@/types/canvas'
import { canvasToScreen } from '@/lib/canvas'
import { useCamera } from '@/context/CanvasContext'

const Cursor: FC<{ pos: Point; color: string }> = ({ pos, color }) => {
	const { camera } = useCamera()

	const { x, y } = useMemo(() => {
		return canvasToScreen(pos, camera)
	}, [pos, camera])

	return (
		<svg
			style={{ transition: 'transform 120ms linear', transform: `translate3d(${x}px, ${y}px, 0)` }}
			className="absolute top-0 left-0 w-9 h-9 z-20"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 35 35"
			fill="currentColor"
			fillRule="evenodd"
		>
			<g className="text-black/20" transform="translate(1,1)">
				<path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
				<path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
			</g>
			<g className="text-white">
				<path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
				<path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
			</g>
			<g fill={color}>
				<path d="m19.751 24.4155-1.844.774-3.1-7.374 1.841-.775z" />
				<path d="m13 10.814v11.188l2.969-2.866.428-.139h4.768z" />
			</g>
		</svg>
	)
}

export default Cursor
