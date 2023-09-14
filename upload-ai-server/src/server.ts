import { fastify } from 'fastify';

const app = fastify();

app.listen({
	port: 3333,
}).then(() => {
	console.log("Running HTTP server at 'http://localhost:3333'");
})

//GET route
app.get('/', () => {
	return "Hello World";
})
