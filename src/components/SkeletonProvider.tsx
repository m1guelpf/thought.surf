import { useTheme } from 'next-themes'
import { FC, PropsWithChildren } from 'react'
import { SkeletonTheme } from 'react-loading-skeleton'

const SkeletonProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	const { theme } = useTheme()

	return (
		<SkeletonTheme
			width={100}
			baseColor={theme == 'dark' ? '#00000020' : '#00000007'}
			highlightColor={theme == 'dark' ? '#00000090' : '#ffffff80'}
		>
			{children}
		</SkeletonTheme>
	)
}

export default SkeletonProvider
