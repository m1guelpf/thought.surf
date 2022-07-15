import { FC } from 'react'

const ResizeIcon: FC<{ className: string }> = ({ className = '' }) => (
	<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
		<path fill="currentColor" d="M10 10H8V8h2v2m0-4H8V4h2v2m-4 4H4V8h2v2m0-4H4V4h2v2m-4 4H0V8h2v2m8-8H8V0h2v2Z" />
	</svg>
)

export default ResizeIcon
