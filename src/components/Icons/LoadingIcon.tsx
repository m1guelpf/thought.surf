import { FC } from 'react'
import { classNames } from '@/lib/utils'

const LoadingIcon: FC<{ className?: string; animated?: boolean; simple?: boolean }> = ({
	className = '',
	simple = false,
	animated = false,
}) => (
	<svg
		fill="none"
		strokeWidth="8%"
		strokeLinecap="round"
		stroke="currentColor"
		viewBox="-2000 -1000 4000 2000"
		className={classNames(className, !simple && 'text-purple-400/10')}
	>
		{!animated && !simple && (
			<defs>
				<linearGradient id="a" x1="0" x2="800" y1="0" y2="0" gradientUnits="userSpaceOnUse">
					<stop offset="0" stopColor="#d8b4fe" />
					<stop offset=".143" stopColor="#d3adfc" />
					<stop offset=".286" stopColor="#c799f5" />
					<stop offset=".429" stopColor="#b67fec" />
					<stop offset=".571" stopColor="#a362e2" />
					<stop offset=".714" stopColor="#9145d8" />
					<stop offset=".857" stopColor="#832dd1" />
					<stop offset="1" stopColor="#7e22ce" />
				</linearGradient>
			</defs>
		)}
		<path id="inf" d="M354-354A500 500 0 1 1 354 354L-354-354A500 500 0 1 0-354 354z"></path>
		{animated || simple ? (
			<use
				className={`text-purple-400/90 ${animated ? 'animate-loading' : ''}`}
				xlinkHref={simple ? '' : '#inf'}
				strokeDasharray="1570 5143"
				strokeDashoffset="6713px"
			></use>
		) : (
			<use stroke="url(#a)" xlinkHref="#inf"></use>
		)}
	</svg>
)

export default LoadingIcon
