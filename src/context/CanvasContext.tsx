import { Camera } from '@/types/canvas'
import { randomId } from 'kbar/lib/utils'
import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useState } from 'react'

const CanvasContext = createContext<{
	roomId: string
	setRoomId: Dispatch<SetStateAction<string>>
	camera: Camera
	setCamera: Dispatch<SetStateAction<Camera>>
	isTransitioning: boolean
	setTransitioning: Dispatch<SetStateAction<boolean>>
}>(null)
CanvasContext.displayName = 'CanvasContext'

export const CanvasProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	const [roomId, setRoomId] = useState<string>(randomId())
	const [camera, setCamera] = useState<Camera>({ x: 1, y: 1, z: 1 })
	const [isTransitioning, setTransitioning] = useState<boolean>(false)

	return (
		<CanvasContext.Provider value={{ roomId, setRoomId, camera, setCamera, isTransitioning, setTransitioning }}>
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

export const useRoomId = () => {
	const { roomId, setRoomId } = useContext(CanvasContext)

	return { roomId, setRoomId }
}

export default CanvasContext
