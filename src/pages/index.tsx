import { FC } from 'react'
import Canvas from '@/components/Canvas'
import CanvasItem from '@/components/CanvasItem'
import Header from '@/components/Header'

const Home: FC = () => {
	return (
		<div className="w-full h-screen overflow-hidden bg-gray-900">
			<Header />
			<Canvas />
		</div>
	)
}

export default Home
