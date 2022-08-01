import toast from 'react-hot-toast'
import { getTextCards } from '@/lib/cards'
import { ask, randomId } from '@/lib/utils'
import { useHistory } from '@/lib/liveblocks'
import { CardCollection } from '@/types/cards'
import { Sections } from '@/types/command-bar'
import { LiveObject } from '@liveblocks/client'
import useRegisterAction from '../useRegisterAction'
import { createURLCard } from '@/components/Cards/URLCard'
import { createTextCard } from '@/components/Cards/TextCard'
import useCamera, { shallow, CameraStore, useRefCamera } from '@/store/camera'
import {
	LinkIcon,
	ReplyIcon,
	CameraIcon,
	ZoomInIcon,
	ZoomOutIcon,
	DocumentAddIcon,
	DocumentSearchIcon,
} from '@heroicons/react/outline'

const getParams = (store: CameraStore) => ({
	zoomIn: store.zoomCameraIn,
	zoomOut: store.zoomCameraOut,
	resetCamera: store.resetCamera,
	setTransition: store.setTransitioning,
})

const useCanvasCommands = (items: CardCollection | null) => {
	const history = useHistory()
	const camera = useRefCamera()
	const { zoomIn, zoomOut, resetCamera, setTransition } = useCamera(getParams, shallow)

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
		[
			{
				id: 'add-text',
				name: 'Add Text Card',
				icon: <DocumentAddIcon />,
				section: Sections.Canvas,
				perform: () => {
					if (!items) throw toast.error('Canvas not loaded yet')

					items.set(
						randomId(),
						new LiveObject(
							createTextCard(camera.current, {
								names: getTextCards(items).map(({ attributes: { title } }) => title),
							})
						)
					)
				},
			},
			{
				id: 'add-url',
				name: 'Add URL Card',
				icon: <LinkIcon />,
				section: Sections.Canvas,
				keywords: ['link', 'bookmark'],
				perform: async () => {
					if (!items) throw toast.error('Canvas not loaded yet')

					items.set(
						randomId(),
						new LiveObject(createURLCard(camera.current, { url: await ask('What URL should we add?') }))
					)
				},
			},
		],
		[items, camera]
	)
	useRegisterAction(
		[
			{
				id: 'zoom-in',
				name: 'Zoom In',
				perform: zoomIn,
				shortcut: 'Equal',
				icon: <ZoomInIcon />,
				keywords: ['bigger'],
				section: Sections.Canvas,
			},
			{
				id: 'zoom-out',
				name: 'Zoom Out',
				perform: zoomOut,
				shortcut: 'Minus',
				icon: <ZoomOutIcon />,
				keywords: ['smaller'],
				section: Sections.Canvas,
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
			resetCamera()
			setTransition(true)
		},
	})
}

export default useCanvasCommands
