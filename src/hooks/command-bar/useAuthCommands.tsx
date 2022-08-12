import toast from 'react-hot-toast'
import { useModal } from 'connectkit'
import { useAccount, useDisconnect } from 'wagmi'
import useRegisterAction from '../useRegisterAction'
import { LogoutIcon } from '@heroicons/react/outline'
import { Priority, Sections } from '@/types/command-bar'
import EthereumIcon from '@/components/Icons/EthereumIcon'

const useAuthCommands = () => {
	const { setOpen } = useModal()
	const { isConnected } = useAccount()
	const { disconnect } = useDisconnect({
		onSuccess: () => {
			toast.success('Disconnected!')
		},
	})

	useRegisterAction(
		{
			id: 'login',
			priority: Priority.HIGH,
			section: Sections.Account,
			name: 'Sign In with Wallet',
			icon: <EthereumIcon />,
			perform: () => setOpen(true),
			keywords: ['account', 'save', 'ethereum', 'wallet', 'login', 'sign-in'],
		},
		[],
		!isConnected
	)

	useRegisterAction(
		{
			id: 'wallet-logout',
			name: 'Sign Out',
			icon: <LogoutIcon />,
			section: Sections.Account,
			priority: Priority.HIGH,
			keywords: ['logout', 'disconnect', 'wallet', 'ethereum'],
			perform: () => disconnect(),
		},
		[],
		isConnected
	)
}

export default useAuthCommands
