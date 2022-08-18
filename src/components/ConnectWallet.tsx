import { ConnectKitButton } from 'connectkit'
import useWalletAuth from '@/hooks/useWalletAuth'

const ConnectWallet = () => {
	useWalletAuth()

	return <ConnectKitButton />
}

export default ConnectWallet
