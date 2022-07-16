import { FC } from 'react'
import { classNames } from '@/lib/utils'

const LoadingIcon: FC<{ className?: string }> = ({ className = '' }) => (
	<svg
		className={classNames(className, 'text-purple-400/10')}
		viewBox="-2000 -1000 4000 2000"
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeWidth="8%"
	>
		<path id="inf" d="M354-354A500 500 0 1 1 354 354L-354-354A500 500 0 1 0-354 354z"></path>
		<use
			className="animate-loading text-purple-400/90"
			xlinkHref="#inf"
			strokeDasharray="1570 5143"
			strokeDashoffset="6713px"
		></use>
	</svg>
)

export default LoadingIcon
