import { FC } from 'react'
import Canvas from '@/components/Canvas'
import Header from '@/components/Header'

const Home: FC = () => {
	return (
		<div className="w-full h-screen overflow-hidden bg-gray-100 dark:bg-black">
			<Header />
			{/* @ts-ignore */}
			<Canvas />
		</div>
	)
}

export default Home
