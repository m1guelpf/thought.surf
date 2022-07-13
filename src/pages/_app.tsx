import 'tailwindcss/tailwind.css'
import { APP_NAME } from '@/lib/consts'
import '@rainbow-me/rainbowkit/styles.css'
import CommandBar from '@/components/CommandBar'
import { chain, createClient, WagmiConfig } from 'wagmi'
import { CanvasProvider } from '@/context/CanvasContext'
import { apiProvider, configureChains, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from 'next-themes'

const { chains, provider } = configureChains(
	[chain.optimism],
	[apiProvider.infura(process.env.NEXT_PUBLIC_INFURA_ID), apiProvider.fallback()]
)

const { connectors } = getDefaultWallets({ appName: APP_NAME, chains })
const wagmiClient = createClient({ autoConnect: true, connectors, provider })

const App = ({ Component, pageProps }) => {
	return (
		<ThemeProvider defaultTheme="dark" attribute="class">
			<WagmiConfig client={wagmiClient}>
				<RainbowKitProvider chains={chains}>
					<CanvasProvider>
						<CommandBar>
							<Toaster />
							<Component {...pageProps} />
						</CommandBar>
					</CanvasProvider>
				</RainbowKitProvider>
			</WagmiConfig>
		</ThemeProvider>
	)
}

export default App
