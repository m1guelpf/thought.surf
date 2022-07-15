import { Priority } from 'kbar'
import { useTheme } from 'next-themes'
import { Sections } from '@/types/command-bar'
import useRegisterAction from '../useRegisterAction'
import { DesktopComputerIcon, MoonIcon, SunIcon } from '@heroicons/react/outline'

const useThemeCommands = () => {
	const { setTheme } = useTheme()

	useRegisterAction({
		id: 'theme',
		name: 'Toggle theme',
		shortcut: ['t'],
		priority: Priority.LOW,
		icon: <DesktopComputerIcon />,
		section: Sections.General,
	})
	useRegisterAction([
		{
			id: 'light',
			name: 'Light',
			icon: <SunIcon />,
			section: Sections.General,
			keywords: 'light theme',
			parent: 'theme',
			perform: () => setTheme('light'),
		},
		{
			id: 'dark',
			name: 'Dark',
			icon: <MoonIcon />,
			section: Sections.General,
			keywords: 'dark theme',
			parent: 'theme',
			perform: () => setTheme('dark'),
		},
		{
			id: 'system',
			name: 'System',
			icon: <DesktopComputerIcon />,
			section: Sections.General,
			keywords: 'system theme',
			parent: 'theme',
			perform: () => setTheme('system'),
		},
	])
}

export default useThemeCommands
