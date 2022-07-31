import toast from 'react-hot-toast'
import { getTextCards } from '@/lib/cards'
import { ask, randomId } from '@/lib/utils'
import { useHistory } from '@/lib/liveblocks'
import { zoomIn, zoomOut } from '@/lib/canvas'
import { CardCollection } from '@/types/cards'
import { Sections } from '@/types/command-bar'
import { LiveObject } from '@liveblocks/client'
import { useCamera } from '@/context/CanvasContext'
import useRegisterAction from '../useRegisterAction'
import { createURLCard } from '@/components/Cards/URLCard'
import { createTextCard } from '@/components/Cards/TextCard'
import {
	LinkIcon,
	ReplyIcon,
	CameraIcon,
	ZoomInIcon,
	ZoomOutIcon,
	DocumentAddIcon,
	DocumentSearchIcon,
} from '@heroicons/react/outline'

const useCanvasCommands = (items: CardCollection | null) => {
	const history = useHistory()
	const { camera } = useCamera()
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
							createTextCard(camera, {
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
						new LiveObject(createURLCard(camera, { url: await ask('What URL should we add?') }))
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
