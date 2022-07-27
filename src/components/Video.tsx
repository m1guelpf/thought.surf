import ReactPlayer from 'react-player'
import { forwardRef, PropsWithChildren, useRef } from 'react'

const Video = ({ src, poster }) => {
	const player = useRef<ReactPlayer>(null)

	return (
		<ReactPlayer loop muted controls url={src} playsinline ref={player} poster={poster} playing wrapper={Wrapper} />
	)
}

const Wrapper = forwardRef<HTMLSpanElement, PropsWithChildren<{}>>(({ children }, ref) => (
	<span ref={ref}>{children}</span>
))
Wrapper.displayName = 'Wrapper'

export default Video
