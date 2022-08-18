import toast from 'react-hot-toast'
import { MAX_FILE_SIZE } from './consts'
import { Upload } from '@aws-sdk/lib-storage'
import { XhrHttpHandler } from '@aws-sdk/xhr-http-handler'
import { CompleteMultipartUploadCommandOutput, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3'

export const uploadFile = async (file: File): Promise<string> => {
	const toastId = toast.loading('Uploading...')
	if (file.size > MAX_FILE_SIZE) throw toast.error('File must be smaller than 10MB', { id: toastId })

	let data = await fetch('/api/file-upload', {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ filename: encodeURIComponent(file.name), size: file.size }),
	}).then(res => res.json())

	if (data.error) throw data.error

	let client = new S3Client({
		region: data.region,
		requestHandler: new XhrHttpHandler(),
		credentials: {
			accessKeyId: data.token.Credentials.AccessKeyId,
			secretAccessKey: data.token.Credentials.SecretAccessKey,
			sessionToken: data.token.Credentials.SessionToken,
		},
	})

	let params = {
		Body: file,
		Key: data.key,
		Bucket: data.bucket,
		ContentType: file.type,
		CacheControl: 'max-age=630720000, public',
	} as PutObjectCommandInput

	let s3Upload = new Upload({ client, params })

	s3Upload.on('httpUploadProgress', progress => {
		const size = progress.total ?? 0
		const uploaded = progress.loaded ?? 0

		if (uploaded) {
			toast.loading(`Uploading... ${Math.floor(size ? (uploaded / size) * 100 : 0)}%`, { id: toastId })
		}
	})

	let uploadResult = (await s3Upload.done()) as CompleteMultipartUploadCommandOutput
	toast.success('Uploaded!', { id: toastId })

	return uploadResult.Location
}
