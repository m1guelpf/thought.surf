import Link from 'next/link'
import { useRef } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { APP_NAME } from '@/lib/consts'
import { JSONContent } from '@tiptap/react'
import { ConnectKitButton } from 'connectkit'
import LoadingIcon from '@/components/Icons/LoadingIcon'
import m1guelpfAvatar from '@images/avatars/m1guelpf.jpg'
import ThemeButton from '@/components/Landing/ThemeButton'
import EditableCard from '@/components/Landing/EditableCard'
import { BubbleHeading } from '@/components/Landing/BubbleText'
import MultiplayerCard from '@/components/Landing/MultiplayerCard'
import { buildDoc, buildHeading, buildParagraph, buildTaskItem, buildTaskList, buildText } from '@/lib/tiptap/builder'
const AnimatedBackground = dynamic(() => import('@/components/Landing/AnimatedBackground'), { ssr: false })

const MotionLink = motion(Link)

const CARD_CONTENTS: Record<string, JSONContent> = {
	readme: buildDoc([
		buildHeading(`# Welcome to ${APP_NAME}`, 3),
		buildParagraph([
			buildText(APP_NAME, { color: '#a855f7', 'font-weight': '500' }),
			' gives you an infinite canvas to organize your thoughts, collaborate with others and brainstorm new ideas. With interactive bookmarks, embeds, and multiplayer, your brain will feel just at home.',
		]),
	]),
	features: buildDoc([
		buildHeading(`# ${APP_NAME} features`, 3),
		buildTaskList([
			buildTaskItem('Infinite canvas with zoom, pan & drag', true),
			buildTaskItem(
				[
					'Cards',
					buildTaskList([
						buildTaskItem('Drag & resize', true),
						buildTaskItem(
							[
								'Bookmark cards',
								buildTaskList([
									buildTaskItem('Screenshot website', true),
									buildTaskItem('"Play" mode (live frame)', true),
								]),
							],
							true
						),
						buildTaskItem('Image/video upload', true),
						buildTaskItem('Tweet embeds', true),
						buildTaskItem('Other embeds', true),
					]),
				],
				true
			),
			buildTaskItem(
				[
					'Multiplayer',
					buildTaskList([
						buildTaskItem('Live cursors', true),
						buildTaskItem('Live typing', true),
						buildTaskItem('Live dragging/resizing/creating', true),
					]),
				],
				true
			),
		]),
	]),
}

const LandingPage = () => {
	const containerRef = useRef<HTMLDivElement>(null)

	return (
		<div className="md:w-screen min-h-screen md:h-screen md:px-4 font-rbk flex flex-col">
			<div className="py-4 px-4 md:px-6 flex items-center justify-between">
				<MotionLink href="/" whileHover={{ scale: 1.05, rotate: -2 }} whileTap={{ scale: 1.05, rotate: 2 }}>
					<LoadingIcon className="w-24 -ml-4 md:m-0" />
				</MotionLink>
				<ConnectKitButton.Custom>
					{({ show, isConnected }) => {
						if (!isConnected) {
							return (
								<motion.button
									onClick={show}
									className="md:text-lg font-bold"
									whileTap={{ scale: 1.05, rotate: 2 }}
									whileHover={{ scale: 1.05, rotate: 2 }}
								>
									Sign in
								</motion.button>
							)
						}

						return (
							<MotionLink
								href="/board/home"
								className="md:text-lg font-bold"
								whileTap={{ scale: 1.05, rotate: 2 }}
								whileHover={{ scale: 1.05, rotate: 2 }}
							>
								Dashboard
							</MotionLink>
						)
					}}
				</ConnectKitButton.Custom>
			</div>
			<div
				className="flex-1 md:mb-3 h-full w-full flex flex-col items-center md:justify-around md:rounded-[48px] pb-10 md:pt-10 relative space-y-6 md:space-y-0 overflow-hidden"
				ref={containerRef}
			>
				<div className="absolute w-full h-full pointer-events-none" aria-hidden>
					<div className="-z-20 bg-purple-200" />
					<AnimatedBackground className="absolute -z-10" />
				</div>
				<BubbleHeading className="mt-4 md:hidden md:[content-visibility:hidden]" containerRef={containerRef} />
				<EditableCard
					title="README.md"
					containerRef={containerRef}
					content={CARD_CONTENTS.readme}
					initialPos={{ x: 303, y: 580 }}
				/>
				<EditableCard
					title="Features.md"
					containerRef={containerRef}
					content={CARD_CONTENTS.features}
					initialPos={{ x: 357, y: 3795 }}
				/>
				<MultiplayerCard containerRef={containerRef} initialPos={{ x: 4789, y: 1068 }} />
				<div className="hidden [content-visibility:hidden] md:[content-visibility:unset] md:absolute inset-0 md:flex items-center justify-center">
					<BubbleHeading containerRef={containerRef} />
				</div>
				<ThemeButton className="absolute bottom-0 right-0" />
				<div className="absolute bottom-4 inset-x-0 flex justify-center z-50 pointer-events-none">
					<motion.a
						target="_blank"
						rel="noreferrer"
						whileHover={{ scale: 1.03 }}
						href="https://twitter.com/m1guelpf"
						className="flex items-center space-x-2 bg-black/10 py-1 pl-4 pr-2 rounded-full pointer-events-auto"
					>
						<p className="text-white">Built by</p>
						<a className="flex items-center space-x-1">
							<Image
								width={30}
								height={30}
								src={m1guelpfAvatar}
								className="rounded-full"
								alt="Miguel Piedrafita's avatar"
							/>
							<p className="font-medium text-white">Miguel Piedrafita</p>
						</a>
					</motion.a>
				</div>
			</div>
		</div>
	)
}

export default LandingPage
