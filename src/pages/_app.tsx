import '@/styles/styles.css'
import { KBarProvider } from 'kbar'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from 'next-themes'
import { LiveMap } from '@liveblocks/client'
import { RoomProvider } from '@/lib/liveblocks'
import CommandBar from '@/components/CommandBar'
import { CanvasProvider } from '@/context/CanvasContext'
import EthereumProvider from '@/components/EthereumProvider'

const App = ({ Component, pageProps }) => {
	return (
		<ThemeProvider defaultTheme="dark" attribute="class">
			<EthereumProvider>
				<RoomProvider id="home" initialStorage={{ items: new LiveMap() }}>
					<CanvasProvider>
						<KBarProvider>
							<Toaster />
							<CommandBar />
							<Component {...pageProps} />
						</KBarProvider>
					</CanvasProvider>
				</RoomProvider>
			</EthereumProvider>
		</ThemeProvider>
	)
}

export default App
