import { FC, memo } from 'react'
import Canvas from '@/components/Canvas'
import Layout from '@/components/Layout'
import { GetStaticPaths, GetStaticProps } from 'next'

const BoardPage: FC<{ roomId: string }> = ({ roomId }) => (
	<Layout roomId={roomId}>
		<Canvas />
	</Layout>
)

export const getStaticPaths: GetStaticPaths = async () => {
	return { paths: [], fallback: true }
}

export const getStaticProps: GetStaticProps = async ({ params: { id: roomId } }) => {
	return { props: { roomId } }
}

export default memo(BoardPage)
