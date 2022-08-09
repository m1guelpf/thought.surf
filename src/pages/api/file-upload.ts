import { randomId } from '@/lib/utils'
import { withSession } from '@/lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { GetFederationTokenCommand, STSClient, STSClientConfig } from '@aws-sdk/client-sts'

let config: STSClientConfig = {
	credentials: {
		accessKeyId: process.env.S3_UPLOAD_KEY as string,
		secretAccessKey: process.env.S3_UPLOAD_SECRET as string,
	},
	region: process.env.S3_UPLOAD_REGION,
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	let key = `uploads/${randomId()}/${req.body.filename.toLowerCase()}`

	let policy = {
		Statement: [
			{
				Sid: 'Stmt1S3UploadAssets',
				Effect: 'Allow',
				Action: ['s3:PutObject'],
				Resource: [`arn:aws:s3:::${process.env.S3_UPLOAD_BUCKET}/${key}`],
			},
		],
	}

	let sts = new STSClient(config)

	let command = new GetFederationTokenCommand({
		Name: 'S3UploadWebToken',
		Policy: JSON.stringify(policy),
		DurationSeconds: 60 * 60, // 1 hour
	})

	res.status(200).json({
		key,
		token: await sts.send(command),
		bucket: process.env.S3_UPLOAD_BUCKET,
		region: process.env.S3_UPLOAD_REGION,
	})
}

export default withSession(handler)
