import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function createTranscriptionRoute(app: FastifyInstance) {
	app.post('/videos/:videoId/transcription', async (req, res) => {
		const paramsSchema = z.object({
			videoId: z.string().uuid(),
		})

		const bodySchema = z.object({
			prompt: z.string()
		})

		const { videoId } = paramsSchema.parse(req.params) //receber parâmetro e validar se está seguindo a estrutura indicada por z.object
		const { prompt } = bodySchema.parse(req.body) //receber Request Body e validar se está seguindo a estrutura indicada por z.object

		return {
			videoId,
			prompt,
		}
	})
}