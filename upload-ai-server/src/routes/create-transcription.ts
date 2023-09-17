import { FastifyInstance } from "fastify";
import { createReadStream } from "node:fs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { openai } from "../lib/openai";

export async function createTranscriptionRoute(app: FastifyInstance) {
	app.post('/videos/:videoId/transcription', async (req) => {
		// validate request data
		const paramsSchema = z.object({
			videoId: z.string().uuid(),
		})

		const bodySchema = z.object({
			prompt: z.string(),
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

		// add AI response
		const response = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: 'whisper-1',
      language: 'pt',
      response_format: 'json',
      temperature: 0,
      prompt,
    })

		// record video's transcription at database table
		const transcription = response.text
		await prisma.video.update({
			where: {
				id: videoId,
			},
			data: {
				transcription,
			}
		})

		return { transcription }
	})
}
/* possível erro:
- Transcrição não sendo realizada ao fazer o "create-transcription" request em route.http
- Erro no server da API da OpenAI
*/