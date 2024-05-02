// Import the framework and instantiate it
import Fastify from 'fastify';
import recipes from './src/routes/recipe.routes.js';

const fastify = Fastify({
  logger: true
})

fastify.register(recipes);


fastify.listen({ port: 5000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})