import { scrapeUrl, read } from '../controllers/scraper.controller.js'

const scrapeUrlOpts = {
    schema: {
      querystring: {
        url: { type: 'string' }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            url: { type: 'string' }
          }
        }
      }
    },
    handler: scrapeUrl
  };

  const readOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        ingredients: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        preparationSteps: {
                            type: 'array',
                            items: { type: 'string' }
                        }
                    }
                }
            }
        }
    },
    handler: read
};
  
  // Définir la route
  function scrapeRoutes(fastify, options, done) {
    fastify.get('/scrape', scrapeUrlOpts);
    fastify.get('/read', readOpts);
    done();
  }
  
  export default scrapeRoutes;