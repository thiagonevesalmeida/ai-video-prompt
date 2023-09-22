import { FastifyInstance } from "fastify";
import { z } from "zod";
import { streamToResponse, OpenAIStream } from "ai";
import { prisma } from "../lib/prisma";
import { openai } from "../lib/openai";

export async function generateAICompletionRoute(app: FastifyInstance) {
	app.post('/ai/complete', async (request, reply) => {
		// validate request data
		const bodySchema = z.object({
			videoId: z.string().uuid(),
			prompt: z.string(),
			temperature: z.number().min(0).max(1).default(0.5),
		})

		const { videoId, prompt ,temperature } = bodySchema.parse(request.body)

		//AI completion
		//procurar e retornar video, caso não retornar erro
		const video = await prisma.video.findUniqueOrThrow({
			where: {
				id: videoId,
			}
		})

		// se não existir transcrição no video, retornar um erro
		if (!video.transcription) {
			return reply.status(400).send({ error: "Video transcription was not generated yet."})
		}
		
		const promptMessage = prompt.replace('{transcription}', video.transcription) //substituir parte da template message ('{transcription}') enviada no "Request Body" pelo video transcription gerado pela AI

		// Chamada para OpenAI
		const response = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo-16k',
			temperature,
			messages: [
				{ role: 'user', content: promptMessage }
			],
			stream: true,
		})

		const stream = OpenAIStream(response)

		streamToResponse(stream, reply.raw, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
			},
		})
	})
}