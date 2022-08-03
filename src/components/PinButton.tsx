import PinIcon from './Icons/PinIcon'
import { motion } from 'framer-motion'
import { FC, memo, MouseEvent, useCallback } from 'react'

type Props = {
	isPinned: boolean
	baseVariant: string
	hoverVariant: string
	onChange: (value: boolean) => void
}

const PinButton: FC<Props> = ({ isPinned, onChange, baseVariant, hoverVariant }) => {
	const onButtonClick = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			onChange(!isPinned)
			event.currentTarget.blur()
		},
		[onChange, isPinned]
	)

	return (
		<motion.button
			className="-ml-7 z-[1]"
			onClick={onButtonClick}
			variants={{ [baseVariant]: { x: 28, opacity: 0 }, [hoverVariant]: { x: 5, opacity: 1 } }}
		>
			<PinIcon animate={{ rotate: isPinned ? 0 : -45 }} className="w-3 h-3 text-gray-400 !origin-center" />
		</motion.button>
	)
}

export default memo(PinButton)
