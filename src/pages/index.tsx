import { FC } from 'react'
import Head from 'next/head'
import { APP_NAME } from '@/lib/consts'
import Canvas from '@/components/Canvas'
import Header from '@/components/Header'

const Home: FC = () => {
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
