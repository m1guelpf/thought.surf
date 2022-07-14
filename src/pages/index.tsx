import { FC } from 'react'
import Canvas from '@/components/Canvas'
import Header from '@/components/Header'

const Home: FC = () => {
	const items = {
		a: {
			id: 'a',
			point: { x: 0, y: 0 },
			size: { width: 300, heigth: 300 },
		},
		b: {
			id: 'b',
			point: { x: 320, y: 200 },
			size: { width: 240, heigth: 600 },
		},
		c: {
			id: 'c',
			point: { x: 500, y: 2000 },
			size: { width: 524, heigth: 300 },
		},
	}

	return (
		<div className="w-full h-screen overflow-hidden bg-gray-100 dark:bg-black">
			<Header />
			{/* @ts-ignore */}
			<Canvas items={items} />
		</div>
	)
}

export default Home
