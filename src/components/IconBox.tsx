import { classNames } from '@/lib/utils'
import Skeleton from 'react-loading-skeleton'

const IconBox = ({ className = '', src, alt }) => {
	return (
		<div
			className={classNames(
				className,
				'relative overflow-hidden rounded-lg w-12 h-12 flex items-center justify-center flex-shrink-0 shadow-border'
			)}
		>
			{src ? (
				<>
					<img
						className="absolute z-[1] pointer-events-none inset-0 w-full h-full"
						style={{ transform: 'scale(2)', filter: 'blur(13px) saturate(1.5) opacity(0.2)' }}
						src={src}
						alt={alt}
					/>
					<img
						className="rounded-lg w-3/4 h-3/4"
						src={src}
						alt={alt}
						style={{ filter: 'drop-shadow(0 1px 4px rgba(0, 0, 0, 0.12))' }}
					/>
				</>
			) : (
				<Skeleton className="rounded-lg" />
			)}
		</div>
	)
}

export default IconBox
