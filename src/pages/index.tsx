import Head from 'next/head'
import { FC, useEffect } from 'react'
import { APP_NAME } from '@/lib/consts'
import Canvas from '@/components/Canvas'
import Header from '@/components/Header'
import { useRoomId } from '@/context/CanvasContext'

const Home: FC = () => {
	const { setRoomId } = useRoomId()

	useEffect(() => {
		setRoomId('home')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<Head>
				<title>{APP_NAME}</title>
			</Head>
			<div className="w-full h-screen overflow-hidden bg-gray-100 dark:bg-black">
				<Header />
				<Canvas />
			</div>
		</>
	)
}

export default Home
