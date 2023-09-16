import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { createReadStream } from "node:fs";

export async function createTranscriptionRoute(app: FastifyInstance) {
	app.post('/videos/:videoId/transcription', async (req, res) => {
		// validate request data
		const paramsSchema = z.object({
			videoId: z.string().uuid(),
		})

		const bodySchema = z.object({
			prompt: z.string()
		})

		const { videoId } = paramsSchema.parse(req.params) //receber parâmetro e validar se está seguindo a estrutura indicada por z.object
		const { prompt } = bodySchema.parse(req.body) //receber Request Body e validar se está seguindo a estrutura indicada por z.object

		// video transcription
		const video = await prisma.video.findUniqueOrThrow({
			where: {
				id: videoId,
			}
		})
		const videoPath = video.path

		const audioReadStream = createReadStream(videoPath)

		return {
			videoId,
			prompt,
			videoPath
		}
	})
}