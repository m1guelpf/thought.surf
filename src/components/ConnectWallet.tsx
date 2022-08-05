import useSWR from 'swr'
import { SiweMessage } from 'siwe'
import { useEffect, useMemo } from 'react'
import { ConnectKitButton } from 'connectkit'
import { useAccount, useSignMessage } from 'wagmi'

const ConnectWallet = () => {
	const { address } = useAccount()

	const { data, isLoading } = useSWR<{ nonce: string; authenticated: boolean }>('/api/auth/login', {
		revalidateOnFocus: false,
	})

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
			})
		},
	})

	useEffect(() => {
		if (!address || isLoading || data?.authenticated) return

		signMessage()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address])

	return <ConnectKitButton />
}

export default ConnectWallet
