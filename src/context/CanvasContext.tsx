import { Camera } from '@/types/canvas'
import useLocalState from '@/hooks/useLocalState'
import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useState } from 'react'

const CanvasContext = createContext<{
	camera: Camera
	setCamera: Dispatch<SetStateAction<Camera>>
	isTransitioning: boolean
	setTransitioning: Dispatch<SetStateAction<boolean>>
}>(null)
CanvasContext.displayName = 'CanvasContext'

export const CanvasProvider: FC<PropsWithChildren<{ roomId: string }>> = ({ children, roomId }) => {
	const [camera, setCamera] = useLocalState<Camera>(`${roomId}-camera`, { x: 1, y: 1, z: 1 })
	const [isTransitioning, setTransitioning] = useState<boolean>(false)

	return (
		<CanvasContext.Provider value={{ camera, setCamera, isTransitioning, setTransitioning }}>
			{children}
		</CanvasContext.Provider>
	)
}

export const useCamera = () => {
	const { camera, setCamera, isTransitioning, setTransitioning } = useContext(CanvasContext)

	const withTransition = <T,>(cb: () => T): T => {
		setTransitioning(true)

		return cb()
	}
	const onTransitionEnd = () => setTransitioning(false)

	return { camera, setCamera, shouldTransition: isTransitioning, withTransition, onTransitionEnd }
}

export default CanvasContext
