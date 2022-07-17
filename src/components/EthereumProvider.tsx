import { FC, PropsWithChildren } from 'react'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'

const EthereumProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	const { provider, chains } = configureChains(
		[chain.mainnet],
		[infuraProvider({ infuraId: process.env.NEXT_PUBLIC_INFURA_ID }), publicProvider()]
	)

	const wagmiClient = createClient({
		autoConnect: true,
		provider,
		connectors: [
			new InjectedConnector({ chains, options: { shimDisconnect: true } }),
			new WalletConnectConnector({ chains, options: { qrcode: true } }),
		],
	})

	return <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
}

export default EthereumProvider
