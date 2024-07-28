import { FC, forwardRef, PropsWithChildren, useRef } from 'react'
import ReactPlayer, { ReactPlayerProps } from 'react-player/lazy'

type Props = {
	src: string
	poster?: string
	inline?: boolean
	style?: Record<string, any>
} & ReactPlayerProps

const Video: FC<Props> = ({ src, poster, style = {}, inline = false, ...baseProps }) => {
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
							style: { objectFit: 'cover', width: '100%', height: '100%', ...style },
						},
					},
				},
			}
		: {
				playing: true,
				config: {
					file: {
						attributes: {
							style: { objectFit: 'cover', width: '100%', height: '100%', ...style },
						},
					},
				},
			}

	return <ReactPlayer controls url={src} {...props} ref={player} poster={poster} wrapper={Wrapper} {...baseProps} />
}

const Wrapper = forwardRef<HTMLSpanElement, PropsWithChildren<{}>>(({ children }, ref) => (
	<span ref={ref}>{children}</span>
))
Wrapper.displayName = 'Wrapper'

export default Video
