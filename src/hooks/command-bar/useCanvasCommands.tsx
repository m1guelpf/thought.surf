import toast from 'react-hot-toast'
import { Card } from '@/types/cards'
import { useAddCard } from '../useCard'
import { getNamedCards } from '@/lib/cards'
import { ask, requestFile } from '@/lib/utils'
import { uploadFile } from '@/lib/file-upload'
import { Sections } from '@/types/command-bar'
import useRegisterAction from '../useRegisterAction'
import { IMAGE_TYPES, VIDEO_TYPES } from '@/lib/consts'
import { createURLCard } from '@/components/Cards/URLCard'
import { createTextCard } from '@/components/Cards/TextCard'
import { createFileCard } from '@/components/Cards/FileCard'
import useCamera, { CameraStore, useRefCamera } from '@/store/camera'
import { useHistory, useMutation, useStorage } from '@liveblocks/react'
import {
	LinkIcon,
	ArrowUturnLeftIcon,
	CameraIcon,
	MagnifyingGlassPlusIcon,
	MagnifyingGlassMinusIcon,
	DocumentPlusIcon,
	DocumentMagnifyingGlassIcon,
	PhotoIcon,
	VideoCameraIcon,
} from '@heroicons/react/24/outline'

const getParams = (store: CameraStore) => ({
	zoomIn: store.zoomCameraIn,
	zoomOut: store.zoomCameraOut,
	resetCamera: store.resetCamera,
	setTransition: store.setTransitioning,
})

const useCanvasCommands = () => {
	const addCard = useAddCard()
	const history = useHistory()
	const camera = useRefCamera()
	const cards = useStorage(root => root.cards)
	const { zoomIn, zoomOut, resetCamera, setTransition } = useCamera(getParams)

	useRegisterAction(
		{
			id: 'canvas',
			name: 'Search Canvas...',
			subtitle: `${cards?.length ?? 'Loading'} cards`,
			icon: <DocumentMagnifyingGlassIcon />,
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
				icon: <ArrowUturnLeftIcon />,
				section: Sections.Canvas,
				keywords: ['back'],
				shortcut: '$mod+KeyZ',
				perform: () => history.undo(),
			},
			{
				id: 'redo-action',
				name: 'Redo',
				icon: <ArrowUturnLeftIcon className="transform -scale-x-100" />,
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
				icon: <DocumentPlusIcon />,
				section: Sections.Canvas,
				perform: () => {
					if (!cards) throw toast.error('Canvas not loaded yet')

					addCard(
						createTextCard(camera.current, {
							names: getNamedCards(cards).map(({ attributes: { title } }) => title),
						})
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
					addCard(createURLCard(camera.current, { url: await ask('What URL should we add?') }))
				},
			},
			{
				id: 'add-image',
				name: 'Add Image Card',
				icon: <PhotoIcon />,
				section: Sections.Canvas,
				keywords: ['upload', 'photo', 'picture'],
				perform: async () => {
					if (!cards) throw toast.error('Canvas not loaded yet')
					const file = await requestFile(IMAGE_TYPES)

					addCard(
						createFileCard(camera.current, {
							name: file.name,
							mimeType: file.type,
							url: await uploadFile(file),
							names: getNamedCards(cards).map(({ attributes: { title } }) => title),
						})
					)
				},
			},
			{
				id: 'add-video',
				name: 'Add Video Card',
				icon: <VideoCameraIcon />,
				section: Sections.Canvas,
				keywords: ['upload', 'video', 'movie'],
				perform: async () => {
					if (!cards) throw toast.error('Canvas not loaded yet')
					const file = await requestFile(VIDEO_TYPES)

					addCard(
						createFileCard(camera.current, {
							name: file.name,
							mimeType: file.type,
							url: await uploadFile(file),
							names: getNamedCards(cards).map(({ attributes: { title } }) => title),
						})
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
				icon: <MagnifyingGlassPlusIcon />,
				keywords: ['bigger'],
				section: Sections.Canvas,
			},
			{
				id: 'zoom-out',
				name: 'Zoom Out',
				perform: zoomOut,
				shortcut: 'Minus',
				icon: <MagnifyingGlassMinusIcon />,
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
