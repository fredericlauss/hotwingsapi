import fastifyCookie from 'fastify-cookie';
import getAuth from '../controllers/auth.controller.js';

const authRoutes = async (fastify, options) => {
  fastify.register(fastifyCookie);

  fastify.get('/auth', {
    schema: {
      tags: ['Auth'],
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      },
      querystring: {
        type: 'object',
        properties: {
          db: { type: 'string', enum: ['mongo', 'sql'] }
        }
      }
    },
    handler: getAuth
  });
}

export default authRoutes;
