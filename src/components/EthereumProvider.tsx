import { useTheme } from 'next-themes'
import { APP_NAME } from '@/lib/consts'
import { createClient, WagmiConfig } from 'wagmi'
import { FC, memo, PropsWithChildren } from 'react'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'

const client = createClient(
	getDefaultClient({ appName: APP_NAME, autoConnect: true, infuraId: process.env.NEXT_PUBLIC_INFURA_ID })
)

const EthereumProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	const { theme } = useTheme()

	return (
		<WagmiConfig client={client}>
			<ConnectKitProvider mode={theme as 'light' | 'dark'}>{children}</ConnectKitProvider>
		</WagmiConfig>
	)
}

export default memo(EthereumProvider)
