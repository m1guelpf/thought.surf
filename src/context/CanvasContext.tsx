import { Camera } from '@/types/canvas'
import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useState } from 'react'

const CanvasContext = createContext<{
	camera: Camera
	setCamera: Dispatch<SetStateAction<Camera>>
	isTransitioning: boolean
	setTransitioning: Dispatch<SetStateAction<boolean>>
}>(null)
CanvasContext.displayName = 'CanvasContext'

export const CanvasProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	const [camera, setCamera] = useState<Camera>({ x: 1, y: 1, z: 1 })
	const [isTransitioning, setTransitioning] = useState<boolean>(false)

	return (
		<CanvasContext.Provider value={{ camera, setCamera, isTransitioning, setTransitioning }}>
			{children}
		</CanvasContext.Provider>
	)
}

export const useCamera = () => useContext(CanvasContext)

export default CanvasContext
