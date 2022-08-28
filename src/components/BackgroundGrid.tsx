import GridIcon from './Icons/GridIcon'
import { Sections } from '@/types/command-bar'
import { classNames, modulate } from '@/lib/utils'
import useCamera, { CameraStore } from '@/store/camera'
import useRegisterAction from '@/hooks/useRegisterAction'

const GRID_SIZE = 8
const STEPS = [
	[-1, 0.15, 64],
	[0.05, 0.375, 16],
	[0.15, 1, 4],
	[0.7, 2.5, 1],
]

const getParams = (store: CameraStore) => ({ ...store.camera, show: store.showGrid, toggle: store.toggleGrid })

const BackgroundGrid = () => {
	const { x, y, z, show, toggle } = useCamera(getParams)

	useRegisterAction(
		{
			id: 'grid',
			section: Sections.Canvas,
			name: 'Toggle Grid',
			icon: <GridIcon />,
			perform: toggle,
		},
		[toggle]
	)

	return (
		<svg
			className={classNames(
				show ? 'opacity-20' : 'opacity-0',
				'absolute w-full h-full select-none pointer-events-none touch-none transition duration-300'
			)}
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				{STEPS.map(([min, mid, size], i) => {
					const s = size * GRID_SIZE * z
					const xo = x * z
					const yo = y * z
					const gxo = xo > 0 ? xo % s : s + (xo % s)
					const gyo = yo > 0 ? yo % s : s + (yo % s)
					const opacity = z < mid ? modulate(z, [min, mid], [0, 1]) : 1

					return (
						<pattern
							key={`grid-pattern-${i}`}
							id={`grid-${i}`}
							width={s}
							height={s}
							patternUnits="userSpaceOnUse"
						>
							<circle
								className="text-black dark:text-white"
								fill="currentColor"
								cx={gxo}
								cy={gyo}
								r={1}
								opacity={opacity}
							/>
						</pattern>
					)
				})}
			</defs>
			{STEPS.map((_, i) => (
				<rect key={`grid-rect-${i}`} width="100%" height="100%" fill={`url(#grid-${i})`} />
			))}
		</svg>
	)
}

export default BackgroundGrid
