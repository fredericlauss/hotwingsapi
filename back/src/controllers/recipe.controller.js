import Recipe from '../models/recipe.model.js';

async function getRecipes(req, reply, fastify) {
  const dbToken = req.query.db;

  if (dbToken === 'sql') {
    reply.send({ message: 'Using SQL database. Implement SQL database logic here.' });
  } else {
    try {
      const recipes = await Recipe.find().exec();
      reply.send({ recipes });
    } catch (error) {
      reply.status(500).send({ error: 'An error occurred while fetching recipes.' });
    }
  }
}
async function getRecipeById(req, reply, fastify) {
  const dbToken = req.query.db;

  if (dbToken === 'sql') {
    reply.send({ message: 'Using SQL database. Implement SQL database logic here.' });
  } else {
    try {
      const recipe = await Recipe.findById(req.params.id).exec();
      if (!recipe) {
        reply.status(404).send({ message: 'Recipe not found' });
        return;
      }
      reply.send(recipe.toObject());
    } catch (error) {
      reply.status(500).send({ error: 'An error occurred while fetching the recipe.' });
    }
  }
}

async function searchRecipesByTitle(req, reply) {
  const dbToken = req.query.db;

  if (dbToken === 'sql') {
    reply.send({ message: 'Using SQL database. Implement SQL database logic here.' });
  } else {
    try {
      const { name } = req.query;
      const recipes = await Recipe.find({ title: { $regex: name, $options: 'i' } }).exec();
      reply.send({ recipes });
    } catch (error) {
      reply.status(500).send({ error: 'An error occurred while searching for recipes.' });
    }
  }
}

async function searchRecipesByIngredient(req, reply) {
  const dbToken = req.query.db;

  if (dbToken === 'sql') {
    reply.send({ message: 'Using SQL database. Implement SQL database logic here.' });
  } else {
    try {
      const { ingredient } = req.query;
      const recipes = await Recipe.find({
        ingredients: { $regex: ingredient, $options: 'i' },
      }).exec();
      reply.send({ recipes });
    } catch (error) {
      reply.status(500).send({ error: 'An error occurred while searching for recipes.' });
    }
  }
}

export { getRecipes, getRecipeById, searchRecipesByTitle, searchRecipesByIngredient };
