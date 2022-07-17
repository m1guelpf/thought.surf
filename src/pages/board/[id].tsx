import { FC } from 'react'
import Canvas from '@/components/Canvas'
import Layout from '@/components/Layout'
import { GetStaticPaths, GetStaticProps } from 'next'

const BoardPage: FC<{ roomId: string }> = ({ roomId }) => {
	return (
		<Layout roomId={roomId}>
			<Canvas />
		</Layout>
	)
}

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [],
		fallback: true,
	}
}

export const getStaticProps: GetStaticProps = async ({ params: { id } }) => {
	return {
		props: {
			roomId: id,
		},
	}
}

export default BoardPage
