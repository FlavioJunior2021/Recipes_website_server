import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { extname, resolve } from 'node:path'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import sharp from 'sharp'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
	app.post('/upload', async (req, res) => {
		const upload = await req.file({
			limits: {
				fileSize: 5242800, // 5Mb
			},
		})

		if (!upload) {
			return res.status(400).send()
		}

		const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
		const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

		if (!isValidFileFormat) {
			return res.status(400).send()
		}

		const fileId = randomUUID()
		const extension = extname(upload.filename)
		const fileName = fileId.concat(extension)

		const filePath = resolve(__dirname, '../../src/uploads', fileName)
    const writeFile = createWriteStream(filePath)

		await pump(upload.file, writeFile)

		const outputFilePath = resolve(__dirname, '../../src/uploads', `resized-${fileName}`)
    await sharp(filePath)
        .resize(500, 500) // Altere para o tamanho desejado
        .toFile(outputFilePath)

		const fullUrl = req.protocol.concat('://').concat(req.hostname)
		const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

		return { fileUrl }
	})
}