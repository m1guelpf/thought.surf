import { SiweMessage } from 'siwe'
import useSWRImmutable from 'swr/immutable'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'

const useWalletAuth = () => {
	const { address } = useAccount()
	const { disconnect } = useDisconnect()
	const isConnected = useRef<boolean>(false)

	const { data, isLoading, mutate } = useSWRImmutable<{ nonce: string; authenticated: boolean }>(
		'/api/auth/login',
		url => fetch(url, { credentials: 'include' }).then(res => res.json())
	)

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

	const onLogout = useCallback(
		(shouldDisconnect: boolean = false) => {
			if (shouldDisconnect) disconnect()
			isConnected.current = false
			localStorage.removeItem('walletconnect')
			fetch('/api/auth/login', { method: 'DELETE', credentials: 'include' })
		},
		[disconnect]
	)

	const { signMessage } = useSignMessage({
		message,
		onError: () => onLogout(true),
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

		onLogout(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address])
}

export default useWalletAuth
