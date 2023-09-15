import { FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart";
import path from "node:path";
import { randomUUID } from "node:crypto";
import fs  from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { prisma } from "../lib/prisma";

const pump = promisify(pipeline);

export async function uploadVideosRoute(app: FastifyInstance) {
	app.register(fastifyMultipart, {
		limits: {
			fileSize: 1_048_576 * 25, //25mb
		}
	})

	app.post('/videos', async (req, res) => {
		const data = await req.file()

		if (!data) {
			return res.status(400).send({error: "Missing file input."})
		}

		//check file extension
		const extension = path.extname(data.filename) 
		if (extension !== ".mp3") {
			return res.status(400).send({error: "Invalid input type, please upload MP3."})
		}

		//save filename - avoid registering files with the same name
		const fileBaseName = path.basename(data.filename, extension)
		const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`
		// where the file will be saved (dir tmp in the project root)
		const uploadDestination = path.resolve(__dirname, '../../tmp', fileUploadName)

		await pump(data.file, fs.createWriteStream(uploadDestination))
	})
}