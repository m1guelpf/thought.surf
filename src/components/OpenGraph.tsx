import useSWR from 'swr'
import TweetLoader from './TweetLoader'
import { MqlResponseData } from '@microlink/mql'
import { uriExpandBlacklist } from '@/lib/consts'

const OpenGraph = ({ url, children }) => {
	const { data, error, isLoading } = useSWR<MqlResponseData>(
		() => url && !uriExpandBlacklist.some(pathname => url.includes(pathname)) && `/api/link-preview?url=${url}`
	)

	if (url.includes('twitter.com/')) return <TweetLoader url={url}>{children}</TweetLoader>

	if (error) {
		return (
			<a href={url} target="_blank" rel="noreferrer">
				{children}
			</a>
		)
	}

	return (
		<figure
			className={`rounded-lg max-w-lg mx-auto overflow-hidden relative not-prose !my-0 group ${
				isLoading ? '' : 'border border-gray-300 dark:border-gray-700 rounded-xl'
			}`}
		>
			{isLoading ? (
				<div className="py-16 px-8 flex items-center justify-center">
					<svg
						className="w-6 h-6 animate-spin text-black dark:text-white text-opacity-40"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle
							fill="none"
							strokeWidth="2"
							strokeLinecap="round"
							strokeDasharray="32"
							cx="12"
							cy="12"
							r="10"
						></circle>
						<circle
							fill="none"
							strokeWidth="2"
							strokeLinecap="round"
							cx="12"
							cy="12"
							r="10"
							opacity="0.25"
						></circle>
					</svg>
				</div>
			) : (
				<a className="block select-none" href={url} target="_blank" rel="noreferrer" draggable="false">
					<div>
						{data.image && (
							<div className="pb-[50%] relative border-b dark:border-gray-700">
								<img
									className="object-cover absolute inset-0 h-full w-full"
									src={data.image.url}
									alt={data.title}
								/>
							</div>
						)}
						<div className="py-2 px-3 space-y-0.5">
							<div className="flex items-center space-x-2">
								{data?.logo && (
									<img className="w-4 h-4 rounded-sm" src={data.logo.url} alt={data.title} />
								)}
								<p className="text-black/40 dark:text-white/40 text-sm">{new URL(data.url).hostname}</p>
							</div>
							<p className="text-black/80 dark:text-white/80 font-medium break-words text-base">
								{data.title}
							</p>
							<p className="text-black/50 dark:text-white/50 text-sm line-clamp-2">{data.description}</p>
						</div>
					</div>
				</a>
			)}
		</figure>
	)
}

export default OpenGraph
