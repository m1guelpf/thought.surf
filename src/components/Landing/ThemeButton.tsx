import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { classNames } from '@/lib/utils'
import { FC, memo, useCallback, useMemo } from 'react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'

const THEME_ICONS = {
	dark: SunIcon,
	light: MoonIcon,
}

const ThemeButton: FC<{ className?: string }> = ({ className }) => {
	const { resolvedTheme, setTheme } = useTheme()

	const Icon = useMemo(() => resolvedTheme && THEME_ICONS[resolvedTheme], [resolvedTheme])

	const toggleTheme = useCallback(() => {
		setTheme(resolvedTheme == 'light' ? 'dark' : 'light')
	}, [resolvedTheme, setTheme])

	return (
		<motion.button
			className={classNames(
				className,
				'border-l-2 border-t-2 border-white dark:border-black pl-3 pr-4 pt-3 pb-4 rounded-tl-xl'
			)}
			onClick={toggleTheme}
		>
			{Icon && <Icon key={resolvedTheme} className="w-6 h-6 text-white dark:text-black" />}
		</motion.button>
	)
}

export default memo(ThemeButton)
