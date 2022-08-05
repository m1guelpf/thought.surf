import { SiweMessage } from 'siwe'
import useSWRImmutable from 'swr/immutable'
import { ConnectKitButton } from 'connectkit'
import { useEffect, useMemo, useRef } from 'react'
import { useAccount, useSignMessage } from 'wagmi'

const ConnectWallet = () => {
	const { address } = useAccount()
	const isConnected = useRef<boolean>(false)

	const { data, isLoading, mutate } = useSWRImmutable<{ nonce: string; authenticated: boolean }>('/api/auth/login')

	const message = useMemo<string>(() => {
		if (typeof window === 'undefined' || !address) return

		return new SiweMessage({
			address,
			chainId: 1,
			version: '1',
			nonce: data?.nonce,
			uri: window.location.origin,
			domain: window.location.host,
			statement: 'Sign in with Ethereum to create your own rooms.',
		}).prepareMessage()
	}, [address, data?.nonce])

	const { signMessage } = useSignMessage({
		message,
		onSuccess: signature => {
			return fetch('/api/auth/login', {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({ message, signature }),
				headers: {
					'Content-Type': 'application/json',
				},
			}).then(() => mutate())
		},
	})

	useEffect(() => {
		if (address) isConnected.current = true
		if (!address || isLoading || data?.authenticated) return

		signMessage()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address, data?.authenticated])

	useEffect(() => {
		if (address || !isConnected.current) return

		isConnected.current = false
		localStorage.removeItem('walletconnect')
		fetch('/api/auth/login', { method: 'DELETE', credentials: 'include' })
	}, [address])

	return <ConnectKitButton />
}

export default ConnectWallet
