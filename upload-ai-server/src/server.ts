import { fastify } from "fastify";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideosRoute } from "./routes/upload-videos";

const app = fastify()

app.register(getAllPromptsRoute)
app.register(uploadVideosRoute)

app.listen({
	port: 3333,
}).then(() => {
	console.log("Running HTTP server at 'http://localhost:3333'")
})
