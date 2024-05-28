import Recipe from '../models/recipe.model.js';


async function getRecipes(req, reply, fastify) {
  const dbToken = req.query.db;

  if (dbToken === 'sql') {
    reply.send({ message: 'Using SQL database. Implement SQL database logic here.' });
  } else {
    try {
      const recipes = await Recipe.find().exec();
      const plainRecipes = recipes.map(recipe => recipe.toObject());
      reply.send({ recipes: plainRecipes });
    } catch (error) {
      reply.status(500).send({ error: 'An error occurred while fetching recipes.' });
    }
  }
}

export default getRecipes;