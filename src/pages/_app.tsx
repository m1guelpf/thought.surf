import '@/styles/styles.css'
import { SWRConfig } from 'swr'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from 'next-themes'
import CommandBar from '@/components/CommandBar'
import { localStorageProvider } from '@/lib/swr-cache'
import EthereumProvider from '@/components/EthereumProvider'
import SkeletonProvider from '@/components/SkeletonProvider'

const fetcher = url => fetch(url).then(res => res.json())

const App = ({ Component, pageProps }) => {
	return (
		<SWRConfig value={{ fetcher, provider: localStorageProvider }}>
			<ThemeProvider defaultTheme="dark" attribute="class">
				<SkeletonProvider>
					<EthereumProvider>
						<Toaster />
						<CommandBar />
						<Component {...pageProps} />
					</EthereumProvider>
				</SkeletonProvider>
			</ThemeProvider>
		</SWRConfig>
	)
}

export default App
