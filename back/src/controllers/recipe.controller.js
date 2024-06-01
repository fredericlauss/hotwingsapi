import Recipe from '../models/recipe.model.js';
import { createClient } from '@supabase/supabase-js';

async function getRecipes(req, reply, fastify) {
  const dbToken = req.query.db;

  if (dbToken === 'sql') {
    const supabase = createClient(process.env.SUPABASEURL, process.env.SUPABASEKEY);

    try {
      // Fetch all recipes
      const { data: recipes, error: recipesError } = await supabase.from('recipes').select('*');
      if (recipesError) throw recipesError;

      // Fetch all ingredients
      const { data: ingredients, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('*');
      if (ingredientsError) throw ingredientsError;

      // Fetch all preparation steps
      const { data: preparationSteps, error: preparationStepsError } = await supabase
        .from('reparation_steps')
        .select('*');
      if (preparationStepsError) throw preparationStepsError;

      // Combine recipes with their ingredients and preparation steps
      const combinedRecipes = recipes.map((recipe) => {
        const recipeIngredients = ingredients
          .filter((ingredient) => ingredient.recipe_id === recipe.id)
          .map((ingredient) => ingredient.name);

        const recipePreparationSteps = preparationSteps
          .filter((step) => step.recipe_id === recipe.id)
          .sort((a, b) => a.step_number - b.step_number)
          .map((step) => step.description);

        return {
          ...recipe,
          ingredients: recipeIngredients,
          preparationSteps: recipePreparationSteps,
        };
      });

      reply.send({ recipes: combinedRecipes });
    } catch (error) {
      console.error('An error occurred while fetching recipes:', error);
      reply.status(500).send({ error: 'An error occurred while fetching recipes.' });
    }
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
    const supabase = createClient(process.env.SUPABASEURL, process.env.SUPABASEKEY);
    const recipeId = req.params.id;

    try {
      // Fetch the recipe by ID
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single();

      if (recipeError) throw recipeError;
      if (!recipe) {
        reply.status(404).send({ message: 'Recipe not found' });
        return;
      }

      // Fetch the ingredients for the recipe
      const { data: ingredients, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('*')
        .eq('recipe_id', recipeId);

      if (ingredientsError) throw ingredientsError;

      // Fetch the preparation steps for the recipe
      const { data: preparationSteps, error: preparationStepsError } = await supabase
        .from('reparation_steps')
        .select('*')
        .eq('recipe_id', recipeId)
        .order('step_number', { ascending: true });

      if (preparationStepsError) throw preparationStepsError;

      // Combine the recipe with its ingredients and preparation steps
      const combinedRecipe = {
        ...recipe,
        ingredients: ingredients.map((ingredient) => ingredient.name),
        preparationSteps: preparationSteps.map((step) => step.description),
      };

      reply.send(combinedRecipe);
    } catch (error) {
      console.error('An error occurred while fetching the recipe:', error);
      reply.status(500).send({ error: 'An error occurred while fetching the recipe.' });
    }
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
