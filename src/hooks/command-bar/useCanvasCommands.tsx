import toast from 'react-hot-toast'
import { getNamedCards } from '@/lib/cards'
import { useHistory } from '@/lib/liveblocks'
import { ask, requestFile } from '@/lib/utils'
import { CardCollection } from '@/types/cards'
import { uploadFile } from '@/lib/file-upload'
import { Sections } from '@/types/command-bar'
import { LiveObject } from '@liveblocks/client'
import useRegisterAction from '../useRegisterAction'
import { createURLCard } from '@/components/Cards/URLCard'
import { createTextCard } from '@/components/Cards/TextCard'
import { createFileCard } from '@/components/Cards/FileCard'
import useCamera, { shallow, CameraStore, useRefCamera } from '@/store/camera'
import {
	LinkIcon,
	ReplyIcon,
	CameraIcon,
	ZoomInIcon,
	ZoomOutIcon,
	DocumentAddIcon,
	DocumentSearchIcon,
	PhotographIcon,
} from '@heroicons/react/outline'

const getParams = (store: CameraStore) => ({
	zoomIn: store.zoomCameraIn,
	zoomOut: store.zoomCameraOut,
	resetCamera: store.resetCamera,
	setTransition: store.setTransitioning,
})

const useCanvasCommands = (cards: CardCollection | null) => {
	const history = useHistory()
	const camera = useRefCamera()
	const { zoomIn, zoomOut, resetCamera, setTransition } = useCamera(getParams, shallow)

	useRegisterAction(
		{
			id: 'canvas',
			name: 'Search Canvas...',
			subtitle: `${cards?.length ?? 'Loading'} cards`,
			icon: <DocumentSearchIcon />,
			section: Sections.Canvas,
			shortcut: '/',
			keywords: ['search', 'find'],
		},
		[cards?.length]
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
					if (!cards) throw toast.error('Canvas not loaded yet')

					cards.insert(
						new LiveObject(
							createTextCard(camera.current, {
								names: getNamedCards(cards).map(({ attributes: { title } }) => title),
							})
						),
						0
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
					if (!cards) throw toast.error('Canvas not loaded yet')

					cards.insert(
						new LiveObject(createURLCard(camera.current, { url: await ask('What URL should we add?') })),
						0
					)
				},
			},
			{
				id: 'add-image',
				name: 'Add Image Card',
				icon: <PhotographIcon />,
				section: Sections.Canvas,
				keywords: ['upload', 'photo', 'picture'],
				perform: async () => {
					if (!cards) throw toast.error('Canvas not loaded yet')

					const file = await requestFile(['image/gif', 'image/jpg', 'image/jpeg', 'image/png'])

					cards.insert(
						new LiveObject(
							createFileCard(camera.current, {
								name: file.name,
								mimeType: file.type,
								url: await uploadFile(file),
								names: getNamedCards(cards).map(({ attributes: { title } }) => title),
							})
						),
						0
					)
				},
			},
		],
		[cards, camera]
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
