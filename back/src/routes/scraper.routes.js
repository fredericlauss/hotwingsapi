import { scrapeUrl, read, populate, populateSupabase } from '../controllers/scraper.controller.js';

const scrapeUrlOpts = {
  schema: {
    tags: ['Data'],
    querystring: {
      url: { type: 'string' },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          url: { type: 'string' },
        },
      },
    },
  },
  handler: scrapeUrl,
};

const readOpts = {
  schema: {
    tags: ['Data'],
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            ingredients: {
              type: 'array',
              items: { type: 'string' },
            },
            preparationSteps: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
      },
    },
  },
  handler: read,
};

const populateOpts = {
  schema: {
    tags: ['Data'],
    querystring: {
      url: { type: 'string' },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
  handler: populate,
};

const populateSupabaseOpts = {
  schema: {
    tags: ['Data'],
    querystring: {
      url: { type: 'string' },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
  handler: populateSupabase,
};

// Définir la route
function scrapeRoutes(fastify, options, done) {
  fastify.get('/scrape', scrapeUrlOpts);
  fastify.get('/readjson', readOpts);
  fastify.get('/populatemongodb', populateOpts);
  fastify.get('/populatesupabase', populateSupabaseOpts);
  done();
}

export default scrapeRoutes;
