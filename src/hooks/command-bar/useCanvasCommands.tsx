import toast from 'react-hot-toast'
import { randomId } from '@/lib/utils'
import { Sections } from '@/types/command-bar'
import { zoomIn, zoomOut } from '@/lib/canvas'
import { useCamera } from '@/context/CanvasContext'
import useRegisterAction from '../useRegisterAction'
import { LiveMap, LiveObject, Lson } from '@liveblocks/client'
import { useBatch, useUpdateMyPresence } from '@/lib/liveblocks'
import { CameraIcon, DocumentSearchIcon, ViewGridAddIcon, ZoomInIcon, ZoomOutIcon } from '@heroicons/react/outline'

const useCanvasCommands = (items: LiveMap<string, Lson> | null) => {
	const batch = useBatch()
	const updateMyPresence = useUpdateMyPresence()
	const { setCamera, setTransitioning } = useCamera()

	useRegisterAction({
		id: 'canvas',
		name: 'Search Canvas...',
		subtitle: `${items?.size ?? 'Loading'} items`,
		icon: <DocumentSearchIcon />,
		section: Sections.Canvas,
		shortcut: ['/'],
		keywords: 'search find',
	})
	useRegisterAction(
		{
			id: 'test-add',
			name: 'Add Item',
			icon: <ViewGridAddIcon />,
			section: Sections.Canvas,
			perform: () => {
				if (!items) throw toast.error('Canvas not loaded yet')

				batch(() => {
					const id = randomId()

					items.set(id, new LiveObject({ point: { x: 500, y: 2000 }, size: { width: 524, heigth: 300 } }))
					updateMyPresence({ selectedItem: id }, { addToHistory: true })
				})
			},
		},
		[],
		false
	)
	useRegisterAction({
		id: 'zoom-in',
		name: 'Zoom In',
		icon: <ZoomInIcon />,
		section: Sections.Canvas,
		shortcut: ['Equal'],
		keywords: 'bigger',
		perform: () => {
			setCamera(zoomIn)

			return () => setCamera(zoomOut)
		},
	})
	useRegisterAction({
		id: 'zoom-out',
		name: 'Zoom Out',
		icon: <ZoomOutIcon />,
		section: Sections.Canvas,
		shortcut: ['Minus'],
		keywords: 'smaller',
		perform: () => {
			setCamera(zoomOut)

			return () => setCamera(zoomIn)
		},
	})
	useRegisterAction({
		id: 'center-camera',
		name: 'Center Camera',
		icon: <CameraIcon />,
		section: Sections.Canvas,
		keywords: 'reset',
		perform: () => {
			setTransitioning(true)
			setCamera({ x: 1, y: 1, z: 1 })
		},
	})
}

export default useCanvasCommands
