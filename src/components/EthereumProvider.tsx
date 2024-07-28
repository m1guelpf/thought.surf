import { useTheme } from 'next-themes'
import { mainnet } from 'wagmi/chains'
import { APP_NAME } from '@/lib/consts'
import { FC, memo, PropsWithChildren } from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
const config = createConfig(
	getDefaultConfig({
		chains: [mainnet],
		appName: APP_NAME,
		walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
		transports: { [mainnet.id]: http(`https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`) },
	})
)

const EthereumProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	const { theme } = useTheme()

	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<ConnectKitProvider mode={theme as 'light' | 'dark'}>{children}</ConnectKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	)
}

export default memo(EthereumProvider)
