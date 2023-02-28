import S3 from 'aws-sdk/clients/s3'
import cuid from 'cuid'
import { unstable_parseMultipartFormData, UploadHandler } from '@remix-run/node'
import { Readable } from 'stream'

const s3 = new S3({
  region: process.env.POKEMON_BUCKET_REGION,
  accessKeyId: process.env.POKEMON_ACCESS_KEY,
  secretAccessKey: process.env.POKEMON_SECRET_ACCESS_KEY,
})

const uploadHandler: UploadHandler = async ({ name, filename, data }) => {
  const stream = Readable.from(data)

  if (name !== 'avatar') {
    stream.resume()
    return
  }

  const { Location } = await s3
    .upload({
      Bucket: process.env.POKEMON_BUCKET_NAME || '',
      Key: `${cuid()}.${filename?.split('.').slice(-1)}`,
      Body: stream,
    })
    .promise()

  return Location
}

export async function uploadAvatar(request: Request) {
  const formData = await unstable_parseMultipartFormData(request, uploadHandler)

  const file = formData.get('avatar')?.toString() || ''

  return file
}
