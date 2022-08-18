import Head from 'next/head'
import Header from './Header'
import CommandBar from './CommandBar'
import { APP_NAME } from '@/lib/consts'
import LoadingScreen from './LoadingScreen'
import { LiveProvider } from '@/lib/liveblocks'
import AuthFailureScreen from './AuthFailureScreen'
import { FC, PropsWithChildren, useState } from 'react'

const Layout: FC<PropsWithChildren<{ roomId: string }>> = ({ children, roomId }) => {
	const [authFailure, setAuthFailure] = useState<boolean>(false)

	if (!roomId) {
		return (
			<div className="w-full h-screen overflow-hidden bg-gray-100 dark:bg-black">
				<LoadingScreen loading={true} />
			</div>
		)
	}

	if (authFailure) {
		return (
			<div className="w-full h-screen overflow-hidden bg-gray-100 dark:bg-black">
				<AuthFailureScreen />
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
			<LiveProvider roomId={roomId} onAuthFailure={() => setAuthFailure(true)}>
				<div className="w-full h-screen overflow-hidden bg-gray-100 dark:bg-black">
					<Header roomId={roomId} />
					{children}
				</div>
			</LiveProvider>
		</>
	)
}

export default Layout
