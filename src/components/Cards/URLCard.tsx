import { getDomain } from '@/lib/utils'
import { Camera } from '@/types/canvas'
import { useRoom } from '@/lib/liveblocks'
import useSWRImmutable from 'swr/immutable'
import Skeleton from 'react-loading-skeleton'
import { screenToCanvas } from '@/lib/canvas'
import { Sections } from '@/types/command-bar'
import { LiveObject } from '@liveblocks/client'
import { MqlResponseData } from '@microlink/mql'
import { LinkIcon } from '@heroicons/react/outline'
import { FC, memo, useEffect, useState } from 'react'
import useRegisterAction from '@/hooks/useRegisterAction'
import { CardOptions, CardType, URLCard } from '@/types/cards'

export const urlCardOptions: CardOptions = {
	resizeAxis: { x: true, y: true },
	childrenDraggable: true,
}

const URLCard: FC<{ item: LiveObject<URLCard>; id: string; navigateTo: () => void }> = ({ id, item, navigateTo }) => {
	const room = useRoom()
	const [
		{
			attributes: { url },
		},
		setItem,
	] = useState(item.toObject())

	useEffect(() => {
		function onChange() {
			setItem(item.toObject())
		}

		return room.subscribe(item, onChange)
	}, [room, item])

	const { data } = useSWRImmutable<MqlResponseData>(() => url && `/api/link-preview?url=${url}`)

	useRegisterAction(
		{
			id: `canvas-item-${id}`,
			name: data?.title ?? getDomain(url),
			icon: <LinkIcon />,
			parent: 'canvas',
			section: Sections.Canvas,
			perform: navigateTo,
		},
		[item, data?.title]
	)

	return (
		<div className="w-full h-full space-y-3 flex flex-col">
			<div className="flex items-center space-x-3">
				<div className="relative overflow-hidden rounded-lg w-12 h-12 flex items-center justify-center flex-shrink-0">
					{data?.logo ? (
						<>
							<img
								className="absolute inset-0 w-full h-full transform filter scale-150 opacity-50 blur-lg rounded-lg -z-10"
								src={data?.logo?.url}
								alt={data?.title}
							/>
							<img className="rounded-lg w-3/4 h-3/4" src={data?.logo?.url} alt={data?.title} />
						</>
					) : (
						<Skeleton />
					)}
				</div>
				<div className="overflow-hidden">
					<p className="select-none">{data?.title ?? <Skeleton />}</p>
					<p className="text-black/60 dark:text-white/40 text-sm select-none whitespace-nowrap truncate min-w-0">
						{data?.description ?? <Skeleton />}
					</p>
				</div>
			</div>
			{data?.screenshot ? (
				<img
					className="min-h-0 flex-1 rounded-lg block object-cover select-none pointer-events-none"
					src={data?.screenshot?.url}
					alt={data?.screenshot?.url}
				/>
			) : (
				<Skeleton />
			)}
		</div>
	)
}

export const createURLCard = (camera: Camera, url: string): URLCard => ({
	point: screenToCanvas({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, camera),
	size: { width: 500, height: 500 },
	type: CardType.URL,
	attributes: { url },
})

export default memo(URLCard)
