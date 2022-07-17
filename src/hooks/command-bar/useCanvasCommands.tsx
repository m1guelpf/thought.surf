import toast from 'react-hot-toast'
import { randomId } from '@/lib/utils'
import { Sections } from '@/types/command-bar'
import { useCamera } from '@/context/CanvasContext'
import useRegisterAction from '../useRegisterAction'
import { LiveMap, LiveObject, Lson } from '@liveblocks/client'
import { screenToCanvas, zoomIn, zoomOut } from '@/lib/canvas'
import { useBatch, useHistory, useUpdateMyPresence } from '@/lib/liveblocks'
import {
	CameraIcon,
	DocumentSearchIcon,
	ReplyIcon,
	ViewGridAddIcon,
	ZoomInIcon,
	ZoomOutIcon,
} from '@heroicons/react/outline'

const useCanvasCommands = (items: LiveMap<string, Lson> | null) => {
	const batch = useBatch()
	const history = useHistory()
	const { camera } = useCamera()
	const updateMyPresence = useUpdateMyPresence()
	const { setCamera, withTransition } = useCamera()

	useRegisterAction(
		{
			id: 'canvas',
			name: 'Search Canvas...',
			subtitle: `${items?.size ?? 'Loading'} items`,
			icon: <DocumentSearchIcon />,
			section: Sections.Canvas,
			shortcut: '/',
			keywords: ['search', 'find'],
		},
		[items?.size]
	)
	useRegisterAction(
		[
			{
				id: 'undo-action',
				name: 'Undo',
				icon: <ReplyIcon />,
				section: Sections.Canvas,
				keywords: ['back'],
				shortcut: '$mod+KeyZ',
				perform: () => history.undo(),
			},
			{
				id: 'redo-action',
				name: 'Redo',
				icon: <ReplyIcon className="transform -scale-x-100" />,
				section: Sections.Canvas,
				keywords: ['forward'],
				shortcut: '$mod+Shift+KeyZ',
				perform: () => history.redo(),
			},
		],
		[history]
	)
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

					items.set(
						id,
						new LiveObject({
							point: screenToCanvas({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, camera),
							size: { width: 500, heigth: 500 },
						})
					)
					updateMyPresence({ selectedItem: id }, { addToHistory: true })
				})
			},
		},
		[items, camera]
	)
	useRegisterAction(
		[
			{
				id: 'zoom-in',
				name: 'Zoom In',
				icon: <ZoomInIcon />,
				section: Sections.Canvas,
				shortcut: 'Equal',
				keywords: ['bigger'],
				perform: () => setCamera(zoomIn),
			},
			{
				id: 'zoom-out',
				name: 'Zoom Out',
				icon: <ZoomOutIcon />,
				section: Sections.Canvas,
				shortcut: 'Minus',
				keywords: ['smaller'],
				perform: () => setCamera(zoomOut),
			},
		],
		[camera]
	)
	useRegisterAction({
		id: 'center-camera',
		name: 'Center Camera',
		icon: <CameraIcon />,
		section: Sections.Canvas,
		keywords: ['reset'],
		perform: () => {
			withTransition(() => setCamera({ x: 1, y: 1, z: 1 }))
		},
	})
}

export default useCanvasCommands
