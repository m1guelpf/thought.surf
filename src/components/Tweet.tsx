import Video from './Video'
import Image from 'next/image'
import { format } from 'date-fns'
import Autolinker from 'autolinker'
import OpenGraph from './OpenGraph'
import { FC, memo, useMemo } from 'react'
import Skeleton from 'react-loading-skeleton'
import { TweetDetails } from '@/types/twitter'
import { getText, getVideoSource } from '@/lib/twitter'

const Tweet: FC<{
	tweet: TweetDetails
	className?: string
	isMini?: boolean
}> = ({ tweet, className = '', isMini = false }) => {
	const endsWithLink = useMemo(() => {
		return tweet.entities?.urls?.find(link => tweet.full_text.endsWith(link.url))
	}, [tweet])

	return (
		<div>
			<div className={`not-prose ${className}`}>
				<div className={`${isMini ? 'border border-gray-300 dark:border-gray-700 rounded-xl py-3 px-3' : ''}`}>
					<div className="flex justify-between">
						<div className="flex items-center mb-3">
							<a
								className="mr-3 flex items-center justify-center"
								href={tweet?.user ? `https://twitter.com/${tweet.user.screen_name}` : null}
								target="_blank"
								rel="noreferrer"
							>
								{tweet?.user ? (
									<Image
										src={tweet.user.profile_image_url_https}
										alt={tweet.user.name}
										width={isMini ? 25 : 40}
										height={isMini ? 25 : 40}
										className="rounded-full"
									/>
								) : (
									<Skeleton width={isMini ? 25 : 40} height={isMini ? 25 : 40} circle />
								)}
							</a>
							<div className={`${isMini ? 'flex items-center space-x-2' : 'space-y-1'}`}>
								<div className="flex items-center space-x-1 leading-none">
									<a
										href={tweet?.user ? `https://twitter.com/${tweet.user.screen_name}` : null}
										target="_blank"
										className="font-semibold text-black/80 dark:text-white/90 hover:underline"
										rel="noreferrer"
									>
										{tweet?.user?.name ?? <Skeleton width={200} />}
									</a>
									{tweet?.user?.verified && (
										<svg
											className="ml-1 w-4 h-4 text-blue-400"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-label="Verified account"
										>
											<g>
												<path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path>
											</g>
										</svg>
									)}
								</div>
								<span className="text-black/40 dark:text-white/50 text-sm block">
									{tweet?.user ? `@${tweet?.user?.screen_name}` : <Skeleton width={70} />}
								</span>
							</div>
						</div>
					</div>
					<div className="flex flex-wrap justify-start items-start flex-1 -mt-1.5">
						<div className="w-full my-1">
							{tweet?.full_text ? (
								<p
									className={`text-black/80 dark:text-white/80 whitespace-pre-line ${
										isMini ? 'text-sm lg:text-base' : ''
									}`}
									dangerouslySetInnerHTML={{
										__html: Autolinker.link(
											getText(tweet).replaceAll(endsWithLink?.display_url, '').toString().trim(),
											{
												mention: 'twitter',
												hashtag: 'twitter',
												sanitizeHtml: true,
												className: 'underline',
											}
										),
									}}
								/>
							) : (
								<Skeleton width="80%" count={3} />
							)}
							{endsWithLink && endsWithLink.display_url != tweet.quoted_status_permalink?.display && (
								<div className="mt-2">
									<OpenGraph url={endsWithLink.expanded_url}>{endsWithLink.display_url}</OpenGraph>
								</div>
							)}
							{tweet.extended_entities?.media && (
								<div className="mt-2 rounded-lg">
									<div
										className={`w-full h-64 object-cover relative rounded-xl overflow-hidden inline-grid ${
											tweet.extended_entities.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
										} gap-0.5 pointer-events-none`}
									>
										{tweet.extended_entities.media.map((media, i) =>
											['video', 'animated_gif'].includes(media.type) ? (
												<div
													key={i}
													className="relative flex-1 object-cover h-64 pointer-events-auto"
												>
													<Video src={getVideoSource(media)} poster={media.media_url_https} />
												</div>
											) : (
												<TweetImage key={i} media={media} />
											)
										)}
									</div>
								</div>
							)}
							{tweet.is_quote_status && (
								<Tweet className="mt-2" tweet={tweet.quoted_status} isMini={true} />
							)}
						</div>
					</div>
					{!isMini && (
						<a
							href={
								tweet?.user
									? `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
									: null
							}
							target="_blank"
							className="mt-2 text-sm text-gray-500 hover:underline"
							rel="noreferrer"
						>
							{tweet?.created_at ? (
								format(new Date(tweet.created_at), 'hh:mm a')
							) : (
								<Skeleton inline width={20} />
							)}{' '}
							·{' '}
							{tweet?.created_at ? (
								format(new Date(tweet.created_at), 'LLL d, yyyy')
							) : (
								<Skeleton inline width={20} />
							)}
						</a>
					)}
				</div>
			</div>
		</div>
	)
}

const BaseTweetImage = ({ media }) => (
	<Image
		alt=""
		loading="lazy"
		objectFit="cover"
		src={media.media_url_https}
		width={media.sizes.large.w}
		height={media.sizes.large.h}
	/>
)

const TweetImage = memo(BaseTweetImage)

export default memo(Tweet)
