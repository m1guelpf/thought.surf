import { memo, useState } from 'react'
import { useOthers } from '@/lib/liveblocks'
import { Sections } from '@/types/command-bar'
import { getBrowserViewport } from '@/lib/canvas'
import { useCamera } from '@/context/CanvasContext'
import useRegisterAction from '@/hooks/useRegisterAction'
import { CubeTransparentIcon } from '@heroicons/react/outline'

const DevMode = () => {
	const others = useOthers()
	const { camera } = useCamera()
	const [devMode, setDevMode] = useState<boolean>(false)

	useRegisterAction({
		id: 'dev-mode',
		name: 'Toggle Debug Info',
		icon: <CubeTransparentIcon />,
		section: Sections.Canvas,
		keywords: ['debug', 'dev', 'mode'],
		perform: () => setDevMode(i => !i),
	})

	if (!devMode) return null

	const viewport = getBrowserViewport(camera)

	return (
		<div className="absolute top-4 left-4 z-30 text-red-500 font-mono">
			<div>zoom: {Math.floor(camera.z * 100)}%</div>
			<div>x: {Math.floor(viewport?.minX)}</div>
			<div>y: {Math.floor(viewport?.minY)}</div>
			<div>width: {Math.floor(viewport?.width)}</div>
			<div>height: {Math.floor(viewport?.height)}</div>
			<div>multiplayer: {others.count}</div>
		</div>
	)
}

export default DevMode