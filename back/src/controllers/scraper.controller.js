import * as cheerio from 'cheerio';
import fs from 'fs';
import fetch from 'node-fetch';
import Recipe from '../models/recipe.model.js';
import { createClient } from '@supabase/supabase-js';

async function scrapeUrl(req, reply) {
  const url = 'https://www.allrecipes.com/recipes/17561/lunch/';
  try {
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);

    const recipeUrls = [];
    $('a.mntl-card-list-items[href^="https://www.allrecipes.com/recipe/"]').each(
      (index, element) => {
        recipeUrls.push($(element).attr('href'));
      }
    );
    const tasks = [];
    for (const link of recipeUrls) tasks.push(scrapeRecipeDetails(link));
    const scrappedPages = await Promise.all(tasks);

    fs.writeFile('data.json', JSON.stringify(scrappedPages), (err) => {
      if (err) {
        console.error("Erreur lors de l'écriture du fichier :", err);
        reply.status(500).send({
          error: "Une erreur s'est produite lors de l'écriture des données dans le fichier JSON.",
        });
      } else {
        console.log("Données scrapées écrites dans le fichier 'data.json'.");
        reply.send({ url });
      }
    });
  } catch (error) {
    console.error('Error while scraping:', error);
    reply.status(500).send({ error: 'An error occurred while scraping the URL' });
  }
}

async function scrapeRecipeDetails(recipeUrl) {
  try {
    const response = await fetch(recipeUrl);
    const body = await response.text();
    const $ = cheerio.load(body);

    // Titre de la recette
    const title = $('h1').text().trim() || 'Titre non trouvé';

    // Ingrédients
    const ingredients = [];
    $('span[data-ingredient-name="true"]').each((index, element) => {
      ingredients.push($(element).text().trim());
    });

    // Étapes de préparation
    const preparationSteps = [];
    $('div.recipe__steps-content ol li p').each((index, element) => {
      preparationSteps.push($(element).text().trim());
    });

    const recipeDetails = {
      title,
      ingredients,
      preparationSteps,
    };

    return recipeDetails;
  } catch (error) {
    console.error('Erreur lors du scraping de la recette :', error);
    return null;
  }
}

async function read(req, reply) {
  try {
    const jsonData = fs.readFileSync('data.json', 'utf8');
    const data = JSON.parse(jsonData);
    reply.send(data);
  } catch (error) {
    console.error('An error occurred while reading JSON:', error);
    reply.status(500).send({ error: 'An error occurred while reading JSON' });
  }
}

async function populate(req, reply) {
  try {
    const recipesData = fs.readFileSync('data.json', 'utf8');
    const recipes = JSON.parse(recipesData);
    await Recipe.insertMany(recipes);
    reply.send('Base de données peuplée avec succès !');
  } catch (error) {
    console.error('Erreur lors du peuplement de la base de données :', error);
    reply.status(500).send('Une erreur est survenue lors du peuplement de la base de données');
  }
}

async function clearMongoDB(req, reply) {
  try {
    await Recipe.deleteMany();
    reply.send({ message: 'Base de données MongoDB vidée avec succès !' });
  } catch (error) {
    console.error(
      'Erreur lors de la suppression des documents de la base de données MongoDB :',
      error
    );
    reply.status(500).send({
      error:
        'Une erreur est survenue lors de la suppression des documents de la base de données MongoDB',
    });
  }
}

async function populateSupabase(req, reply) {
  const supabase = createClient(process.env.SUPABASEURL, process.env.SUPABASEKEY);

  try {
    const recipesData = fs.readFileSync('data.json', 'utf8');
    const data = JSON.parse(recipesData);

    const insertPromises = data.map(async (recipe) => {
      const { title, ingredients, preparationSteps } = recipe;
      console.log('title', title, 'ingredients', ingredients, 'preparationSteps', preparationSteps);
      if (!title || !ingredients || !preparationSteps) {
        console.error('Invalid recipe structure', recipe);
        return;
      }

      try {
        const { data: recipeData, error: recipeError } = await supabase
          .from('recipes')
          .insert({ title })
          .select();

        if (recipeError) {
          console.error('Error inserting recipe:', recipeError);
          return;
        }

        const recipeId = recipeData[0].id;

        const ingredientsData = ingredients.map((name) => ({ recipe_id: recipeId, name }));
        const { error: ingredientsError } = await supabase
          .from('ingredients')
          .insert(ingredientsData);

        if (ingredientsError) {
          console.error('Error inserting ingredients:', ingredientsError);
          return;
        }

        const preparationStepsData = preparationSteps.map((description, index) => ({
          recipe_id: recipeId,
          step_number: index + 1,
          description,
        }));

        const { error: stepsError } = await supabase
          .from('reparation_steps')
          .insert(preparationStepsData);

        if (stepsError) {
          console.error(
            'Error inserting preparation steps:',
            stepsError,
            'from',
            preparationStepsData
          );
          return;
        }

        console.log(`Successfully inserted recipe ${recipe.title}`);
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    });

    await Promise.all(insertPromises);

    reply.send('Base de données Supabase peuplée avec succès !');
  } catch (error) {
    console.error('Erreur lors du peuplement de la base de données :', error);
    reply.status(500).send('Erreur lors du peuplement de la base de données :', error);
  }
}

export { scrapeUrl, read, populate, populateSupabase, clearMongoDB };
