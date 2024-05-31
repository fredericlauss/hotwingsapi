import * as cheerio from 'cheerio';
import fs from 'fs';
import fetch from 'node-fetch';
import Recipe from '../models/recipe.model.js';

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
        reply
          .status(500)
          .send({
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

export { scrapeUrl, read, populate };
