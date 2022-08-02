import ReactPlayer from 'react-player'
import { forwardRef, PropsWithChildren, useRef } from 'react'

const Video = ({ src, poster, inline = false }) => {
	const player = useRef<ReactPlayer>(null)

	const props = inline
		? {
				loop: true,
				muted: true,
				playsinline: true,
				playing: true,
				config: {
					file: {
						attributes: {
							style: { objectFit: 'cover', width: '100%', height: '100%' },
						},
					},
				},
		  }
		: {
				playing: true,
				config: {
					file: {
						attributes: {
							style: { objectFit: 'cover', width: '100%', height: '100%' },
						},
					},
				},
		  }

	return <ReactPlayer controls url={src} {...props} ref={player} poster={poster} wrapper={Wrapper} />
}

const Wrapper = forwardRef<HTMLSpanElement, PropsWithChildren<{}>>(({ children }, ref) => (
	<span ref={ref}>{children}</span>
))
Wrapper.displayName = 'Wrapper'

export default Video
