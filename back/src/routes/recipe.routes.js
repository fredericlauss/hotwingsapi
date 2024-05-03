import getRecipes from '../controllers/recipe.controller.js'
  // Recipe schema
  const Recipe = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
    },
  }
  
  // Options for get all recipe
  const getRecipesOpts = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            recipes: { type: 'array', items: Recipe },
          },
        },
      },
    },
    handler: getRecipes,
  }

  const getOpts = {
    schema: {
        tags: ["Default"],
        response: {
            200: {
                type: "object",
                properties: {
                    anything: { type: "string" },
                },
            },
        },
    },
    handler: (req, res) => {
        res.send({ anything: "meaningfull" });
    },
  }
  
  
  function recipeRoutes(fastify, options, done) {
    // Get all items
    fastify.get('/recipes', getRecipesOpts)
    fastify.get('/', getOpts)  
    done()
  }
  
export default recipeRoutes;