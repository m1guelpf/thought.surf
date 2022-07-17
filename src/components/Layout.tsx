import Head from 'next/head'
import Header from './Header'
import CommandBar from './CommandBar'
import { APP_NAME } from '@/lib/consts'
import LoadingScreen from './LoadingScreen'
import { FC, PropsWithChildren } from 'react'
import { LiveProvider } from '@/lib/liveblocks'
import { CanvasProvider } from '@/context/CanvasContext'

const Layout: FC<PropsWithChildren<{ roomId: string }>> = ({ children, roomId }) => {
	if (!roomId) {
		return (
			<div className="w-full h-screen overflow-hidden bg-gray-100 dark:bg-black">
				<LoadingScreen loading={true} />
			</div>
		)
	}

	return (
		<>
			<Head>
				<title>
					{roomId} - {APP_NAME}
				</title>
			</Head>
			<LiveProvider roomId={roomId}>
				<CanvasProvider roomId={roomId}>
					<CommandBar />
					<div className="w-full h-screen overflow-hidden bg-gray-100 dark:bg-black">
						<Header />
						{children}
					</div>
				</CanvasProvider>
			</LiveProvider>
		</>
	)
}

export default Layout
