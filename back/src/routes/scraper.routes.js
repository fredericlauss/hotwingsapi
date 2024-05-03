import scrapeUrl from '../controllers/scraper.controller.js'

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
  
  // Définir la route
  function scrapeRoutes(fastify, options, done) {
    fastify.get('/scrape', scrapeUrlOpts);
    done();
  }
  
  export default scrapeRoutes;