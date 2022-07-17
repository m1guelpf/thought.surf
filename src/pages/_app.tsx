import '@/styles/styles.css'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from 'next-themes'
import EthereumProvider from '@/components/EthereumProvider'
import { CommandBarProvider } from '@/context/CommandBarContext'

const App = ({ Component, pageProps }) => {
	return (
		<ThemeProvider defaultTheme="dark" attribute="class">
			<EthereumProvider>
				<CommandBarProvider>
					<Toaster />
					<Component {...pageProps} />
				</CommandBarProvider>
			</EthereumProvider>
		</ThemeProvider>
	)
}

export default App
