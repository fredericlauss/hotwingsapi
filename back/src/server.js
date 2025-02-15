// Import the framework and instantiate it
import Fastify from 'fastify';
import mongoose from 'mongoose';
import recipe from './routes/recipe.routes.js';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import scrapeRoutes from './routes/scraper.routes.js';
import authRoutes from './routes/auth.routes.js';

const fastify = Fastify({
  logger: true,
});

const swaggerOptions = {
  swagger: {
    info: {
      title: 'Hotwings API',
      description: 'Hotwings API',
      version: '1.0.0',
    },
    host: process.env.BASE_URL,
    tags: [
      { name: 'Recipes', description: 'Recipes related endpoints' },
      { name: 'Data', description: 'Web scraping related endpoints' },
      { name: 'Auth', description: 'A/B testing related endpoints' },
    ],
  },
};

const swaggerUiOptions = {
  routePrefix: '/docs',
  exposeRoute: true,
};

fastify.register(fastifySwagger, swaggerOptions);
fastify.register(fastifySwaggerUi, swaggerUiOptions);

try {
  mongoose.connect(process.env.MONGO_URI);
  console.log('Connexion à la base de données MongoDB réussie');
} catch (e) {
  console.error(e);
}

fastify.register(recipe);
fastify.register(scrapeRoutes);
fastify.register(authRoutes);

try {
  fastify.listen({ port: 5000, host: '0.0.0.0' });
} catch (error) {
  fastify.log.error(error);
  process.exit(1);
}
