import '@/styles/styles.css'
import { KBarProvider } from 'kbar'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from 'next-themes'
import { LiveProvider } from '@/lib/liveblocks'
import CommandBar from '@/components/CommandBar'
import { CanvasProvider } from '@/context/CanvasContext'
import EthereumProvider from '@/components/EthereumProvider'

const App = ({ Component, pageProps }) => {
	return (
		<ThemeProvider defaultTheme="dark" attribute="class">
			<EthereumProvider>
				<CanvasProvider>
					<LiveProvider>
						<KBarProvider>
							<Toaster />
							<CommandBar />
							<Component {...pageProps} />
						</KBarProvider>
					</LiveProvider>
				</CanvasProvider>
			</EthereumProvider>
		</ThemeProvider>
	)
}

export default App
