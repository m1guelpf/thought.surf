import Link from 'next/link'
import { useRef } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { APP_NAME } from '@/lib/consts'
import FileCard from '@/components/Landing/FileCard'
import LoadingIcon from '@/components/Icons/LoadingIcon'
import m1guelpfAvatar from '@images/avatars/m1guelpf.jpg'
import { BubbleHeading } from '@/components/Landing/BubbleText'
import MultiplayerCard from '@/components/Landing/MultiplayerCard'
const AnimatedBackground = dynamic(() => import('@/components/Landing/AnimatedBackground'), { ssr: false })

const MotionLink = motion(Link)

const LandingPage = () => {
	const containerRef = useRef<HTMLDivElement>(null)

	return (
		<div className="md:w-screen min-h-screen md:h-screen md:px-4 font-rbk flex flex-col">
			<div className="py-4 px-4 md:px-6 flex items-center justify-between">
				<MotionLink href="/" whileHover={{ scale: 1.05, rotate: -2 }} whileTap={{ scale: 1.05, rotate: 2 }}>
					<LoadingIcon className="w-24 -ml-4 md:m-0" />
				</MotionLink>
				<motion.button
					whileHover={{ scale: 1.05, rotate: 2 }}
					whileTap={{ scale: 1.05, rotate: 2 }}
					className="md:text-lg font-bold"
				>
					Sign in
				</motion.button>
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
				<FileCard
					className="py-3 px-6"
					title="README.md"
					containerRef={containerRef}
					initialPos={{ x: 52, y: 110 }}
				>
					<p className="max-w-[18rem] md:max-w-md text-sm md:text-lg">
						<h1 className="text-2xl font-medium mb-3"># Welcome to {APP_NAME}</h1>
						<span className="font-medium text-purple-500">{APP_NAME}</span> gives you an infinite canvas to
						organize your thoughts, collaborate with others and brainstorm new ideas. With interactive
						bookmarks, embeds, and multiplayer, your brain will feel just at home.
					</p>
				</FileCard>
				<MultiplayerCard containerRef={containerRef} initialPos={{ x: 540, y: 60 }} />
				<div className="hidden [content-visibility:hidden] md:[content-visibility:unset] md:absolute inset-0 md:flex items-center justify-center">
					<BubbleHeading containerRef={containerRef} />
				</div>
				<div className="absolute bottom-4 inset-x-0 flex justify-center z-50">
					<motion.a
						target="_blank"
						rel="noreferrer"
						whileHover={{ scale: 1.03 }}
						href="https://twitter.com/m1guelpf"
						className="flex items-center space-x-2 bg-black/10 py-1 pl-4 pr-2 rounded-full"
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
