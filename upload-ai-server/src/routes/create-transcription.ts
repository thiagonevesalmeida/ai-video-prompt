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


		return response.text
	})
}
/* possível erro:

- Integração/Importação da lib openAi - certifique-se que está escrevendo openAi corretamente
- route.http - prompt pode está dando erro
- .env - API Keys
- Erro na própria conexão da API da OPENAI
*/