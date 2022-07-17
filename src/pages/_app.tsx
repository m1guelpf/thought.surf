import '@/styles/styles.css'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from 'next-themes'
import EthereumProvider from '@/components/EthereumProvider'

const App = ({ Component, pageProps }) => {
	return (
		<ThemeProvider defaultTheme="dark" attribute="class">
			<EthereumProvider>
				<Toaster />
				<Component {...pageProps} />
			</EthereumProvider>
		</ThemeProvider>
	)
}

export default App
