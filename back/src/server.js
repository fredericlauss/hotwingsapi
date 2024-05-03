// Import the framework and instantiate it
import Fastify from 'fastify';
import mongoose from 'mongoose';
import recipe from './routes/recipe.routes.js';
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

const fastify = Fastify({
  logger: true
})


const swaggerOptions = {
  swagger: {
      info: {
          title: "Hotwings API",
          description: "dual DB API",
          version: "1.0.0",
      },
      host: "localhost:5000",
  },
};

const swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
};

fastify.register(fastifySwagger, swaggerOptions);
fastify.register(fastifySwaggerUi, swaggerUiOptions);

try {
  mongoose.connect('mongodb://userAdmin:userPassword@mongo');
  console.log('Connexion à la base de données MongoDB réussie');
} catch (e) {
  console.error(e);
}

fastify.register(recipe);



try {
  fastify.listen({ port: 5000, host: '0.0.0.0' })
} catch (error) {
  fastify.log.error(error)
  process.exit(1)
}