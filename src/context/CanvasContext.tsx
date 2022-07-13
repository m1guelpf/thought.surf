import { Camera } from '@/types/canvas'
import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useState } from 'react'

const CanvasContext = createContext<{ camera: Camera; setCamera: Dispatch<SetStateAction<Camera>> }>(null)
CanvasContext.displayName = 'CanvasContext'

export const CanvasProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	const [camera, setCamera] = useState<Camera>({ x: 1, y: 1, z: 1 })

	return <CanvasContext.Provider value={{ camera, setCamera }}>{children}</CanvasContext.Provider>
}

export const useCamera = () => useContext(CanvasContext)

export default CanvasContext
