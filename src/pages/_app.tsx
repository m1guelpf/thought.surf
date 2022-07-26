import '@/styles/styles.css'
import { SWRConfig } from 'swr'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from 'next-themes'
import { localStorageProvider } from '@/lib/swr-cache'
import EthereumProvider from '@/components/EthereumProvider'
import SkeletonProvider from '@/components/SkeletonProvider'
import { CommandBarProvider } from '@/context/CommandBarContext'

const App = ({ Component, pageProps }) => {
	return (
		<SWRConfig value={{ provider: localStorageProvider, fetcher: url => fetch(url).then(res => res.json()) }}>
			<ThemeProvider defaultTheme="dark" attribute="class">
				<SkeletonProvider>
					<EthereumProvider>
						<CommandBarProvider>
							<Toaster />
							<Component {...pageProps} />
						</CommandBarProvider>
					</EthereumProvider>
				</SkeletonProvider>
			</ThemeProvider>
		</SWRConfig>
	)
}

export default App
