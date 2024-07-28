import { useTheme } from 'next-themes'
import useRegisterAction from '../useRegisterAction'
import { Priority, Sections } from '@/types/command-bar'
import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'

const useThemeCommands = () => {
	const { setTheme } = useTheme()

	useRegisterAction({
		id: 'theme',
		name: 'Toggle theme',
		shortcut: 't',
		priority: Priority.LOW,
		icon: <ComputerDesktopIcon />,
		section: Sections.General,
	})
	useRegisterAction([
		{
			id: 'light',
			name: 'Light',
			icon: <SunIcon />,
			section: Sections.General,
			keywords: ['light', 'theme'],
			parent: 'theme',
			perform: () => setTheme('light'),
		},
		{
			id: 'dark',
			name: 'Dark',
			icon: <MoonIcon />,
			section: Sections.General,
			keywords: ['dark', 'theme'],
			parent: 'theme',
			perform: () => setTheme('dark'),
		},
		{
			id: 'system',
			name: 'System',
			icon: <ComputerDesktopIcon />,
			section: Sections.General,
			keywords: ['system', 'theme'],
			parent: 'theme',
			perform: () => setTheme('system'),
		},
	])
}

export default useThemeCommands
