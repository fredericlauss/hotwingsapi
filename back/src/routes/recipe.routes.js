import {
  getRecipes,
  getRecipeById,
  searchRecipesByTitle,
  searchRecipesByIngredient,
} from '../controllers/recipe.controller.js';
import fastifyCookie from 'fastify-cookie';

const RecipeSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
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
};

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
        db: { type: 'string', enum: ['mongo', 'sql'] },
      },
    },
  },
  handler: getRecipes,
};

const getRecipeByIdOpts = {
  schema: {
    tags: ['Recipes'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
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
        db: { type: 'string', enum: ['mongo', 'sql'] },
      },
    },
  },
  handler: getRecipeById,
};

const searchRecipesByTitleOpts = {
  schema: {
    tags: ['Recipes'],
    querystring: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        db: { type: 'string', enum: ['mongo', 'sql'] },
      },
      required: ['name'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          recipes: { type: 'array', items: RecipeSchema },
        },
      },
    },
  },
  handler: searchRecipesByTitle,
};

const searchRecipesByIngredientOpts = {
  schema: {
    tags: ['Recipes'],
    querystring: {
      type: 'object',
      properties: {
        ingredient: { type: 'string' },
        db: { type: 'string', enum: ['mongo', 'sql'] },
      },
      required: ['ingredient'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          recipes: { type: 'array', items: RecipeSchema },
        },
      },
    },
  },
  handler: searchRecipesByIngredient,
};

function recipeRoutes(fastify, options, done) {
  fastify.register(fastifyCookie);
  fastify.get('/recipes', getRecipesOpts);
  fastify.get('/recipes/:id', getRecipeByIdOpts);
  fastify.get('/recipes/searchByTitle', searchRecipesByTitleOpts);
  fastify.get('/recipes/searchByIngredient', searchRecipesByIngredientOpts);
  done();
}

export default recipeRoutes;
