import toast from 'react-hot-toast'
import { useSignMessage } from 'wagmi'
import useRegisterAction from '../useRegisterAction'
import { Priority, Sections } from '@/types/command-bar'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import WalletConnectIcon from '@/components/Icons/WalletConnectIcon'
import { CubeIcon, LightningBoltIcon, LogoutIcon } from '@heroicons/react/outline'

const useAuthCommands = () => {
	const { disconnect } = useDisconnect({
		onSuccess: () => {
			toast.success('Disconnected!')
		},
	})

	const { address, isConnected } = useAccount()
	const { signMessageAsync } = useSignMessage()
	const { connectAsync, connectors } = useConnect()

	useRegisterAction(
		{
			id: 'login',
			name: 'Sign In with Wallet',
			icon: <LightningBoltIcon />,
			section: Sections.Account,
			priority: Priority.HIGH,
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
			perform: () => {
				disconnect()
				localStorage.removeItem('walletconnect')
			},
		},
		[],
		isConnected
	)

	useRegisterAction(
		connectors.map(connector => ({
			id: `connect-${connector.id}`,
			name: connector.name,
			icon: connector.id == 'walletConnect' ? <WalletConnectIcon className="mt-1" /> : <CubeIcon />,
			section: Sections.Account,
			parent: 'login',
			perform: async () => {
				await connectAsync({ connector })

				const signature = await signMessageAsync({ message: 'test' })

				toast.success('Connected!')
			},
		})),
		[],
		!isConnected
	)
}

export default useAuthCommands
