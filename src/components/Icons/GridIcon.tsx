const GridIcon = ({ className = '' }) => (
	<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
		<g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" clipPath="url(#a)">
			<path d="M8.25 4.75v14.5M19.25 8.25H4.75M19.25 15.75H4.75M15.75 4.75v14.5" />
		</g>
		<defs>
			<clipPath id="a">
				<path fill="#fff" d="M0 0h24v24H0z" />
			</clipPath>
		</defs>
	</svg>
)

export default GridIcon
