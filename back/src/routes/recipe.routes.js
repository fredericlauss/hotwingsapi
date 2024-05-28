import {getRecipes, getRecipeById} from '../controllers/recipe.controller.js';
import fastifyCookie from 'fastify-cookie';

const RecipeSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    title: { type: 'string' },
    ingredients: {
      type: 'array',
      items: { type: 'string' }
    },
    preparationSteps: {
      type: 'array',
      items: { type: 'string' }
    }
  },
}


const getRecipesOpts = {
  schema: {
    tags: ['Recipes'],
    response: {
      200: {
        type: 'object',
        properties: {
          recipes: { type: 'array', items: RecipeSchema },
        },
      },
    },
    querystring: {
      type: 'object',
      properties: {
        db: { type: 'string', enum: ['mongo', 'sql'] }
      }
    }
  },
  handler: getRecipes,
}

const getRecipeByIdOpts = {
  schema: {
    tags: ['Recipes'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id']
    },
    response: {
      200: RecipeSchema,
      404: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
    querystring: {
      type: 'object',
      properties: {
        db: { type: 'string', enum: ['mongo', 'sql'] }
      }
    }
  },
  handler: getRecipeById,
};

function recipeRoutes(fastify, options, done) {
  fastify.register(fastifyCookie);
  fastify.get('/recipes', getRecipesOpts);
  fastify.get('/recipes/:id', getRecipeByIdOpts);
  done()
}

export default recipeRoutes;
