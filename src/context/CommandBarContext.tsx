import { Action } from '@/types/command-bar'
import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useState } from 'react'

const CommandBarContext = createContext<{
	commands: Action[]
	setCommands: Dispatch<SetStateAction<Action[]>>
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
}>(null)
CommandBarContext.displayName = 'CommandBarContext'

export const CommandBarProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	const [commands, setCommands] = useState([])
	const [open, setOpen] = useState<boolean>(false)

	return (
		<CommandBarContext.Provider value={{ commands, setCommands, open, setOpen }}>
			{children}
		</CommandBarContext.Provider>
	)
}

export const useCommandBar = () => {
	const { commands, setCommands, open, setOpen } = useContext(CommandBarContext)

	return { commands, setCommands, open, setOpen }
}

export default CommandBarContext