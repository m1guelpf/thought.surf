import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html className="h-full">
			<Head />
			<body className="h-full bg-gray-100 dark:bg-black">
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
