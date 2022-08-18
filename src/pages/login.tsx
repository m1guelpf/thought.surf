import Link from 'next/link'
import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { APP_NAME } from '@/lib/consts'
import { ConnectKitButton } from 'connectkit'
import useWalletAuth from '@/hooks/useWalletAuth'
import LoadingIcon from '@/components/Icons/LoadingIcon'
const AnimatedBackground = dynamic(() => import('@/components/Landing/AnimatedBackground'), { ssr: false })

const LoginPage = () => {
	const router = useRouter()
	const { loading, authenticated } = useWalletAuth()

	useEffect(() => {
		if (loading || !authenticated) return

		router.push(`/${router.query.redirect || 'dashboard'}`)
	}, [loading, authenticated, router])

	return (
		<div className="min-h-screen flex bg-pattern">
			<AnimatedBackground className="absolute inset-0 w-full h-full" />
			<div className="flex flex-col items-center justify-center z-10 w-full">
				<div className="max-w-xl w-full rounded-xl bg-black/20 backdrop-filter backdrop-blur-xl flex flex-col items-center space-y-6 py-10">
					<div className="flex flex-col space-y-3">
						<LoadingIcon className="h-12 w-auto text-white" simple />
						<h2 className="text-3xl font-bold text-white font-rbk text-center">Welcome back!</h2>
						<p className="text-white text-center max-w-sm font-rbk mx-auto">
							To continue to {APP_NAME}, please login with your Ethereum wallet.
						</p>
					</div>
					<ConnectKitButton />
				</div>
			</div>
		</div>
	)
}

export default LoginPage
