import xpath from 'xpath-html';
import fs from 'fs';
import fetch from 'node-fetch'

async function scrapeUrl(req, reply) {
  const url = "https://www.allrecipes.com/recipes/17561/lunch/";

  try {
    const response = await fetch(url);
    const body = await response.text();
    const document = xpath.fromPageSource(body);

    const recipeUrls = [];
    const recipeLinks = document.findElements("//a[contains(@class, 'mntl-card-list-items')][starts-with(@href, 'https://www.allrecipes.com/recipe/')]");
    recipeLinks.forEach(link => {
      recipeUrls.push(link.getAttribute('href'));
    });

    const allRecipesDetails = [];
    for (const recipeUrl of recipeUrls) {
        const recipeDetails = await scrapeRecipeDetails(recipeUrl);
        allRecipesDetails.push(recipeDetails);
      }
  
    //   fs.writeFile('all_recipes_details.json', JSON.stringify(allRecipesDetails), (err) => {
    //     if (err)
    //       console.error("Erreur lors de l'écriture du fichier :", err);
    //     else
    //       console.log("Détails de toutes les recettes extraits et écrits dans le fichier 'all_recipes_details.json'.");
    //   });

      console.log(JSON.stringify(allRecipesDetails));
  
      reply.send({ url });
    } catch (error) {
      console.error('Error while scraping:', error);
      reply.status(500).send({ error: 'An error occurred while scraping the URL' });
    }
  }
  
  async function scrapeRecipeDetails(recipeUrl) {
    try {
      const response = await fetch(recipeUrl);
      const body = await response.text();
      const document = xpath.fromPageSource(body);
  
      // Titre de la recette
      const titleElement = document.findElement("//h1");
      const title = titleElement ? titleElement.getText().trim() : "Titre non trouvé";
      
      const ingredientsElements = document.findElements("//span[@data-ingredient-name='true']");
      const ingredients = ingredientsElements.map(ingredientElement => ingredientElement.getText().trim());
      
      
      // Étapes de préparation de la recette
      const stepsElements = document.findElements("//div[contains(@class, 'recipe__steps-content')]//ol//li//p");
      const preparationSteps = stepsElements.map(stepElement => stepElement.getText().trim());

      
      const recipeDetails = {
        title,
        ingredients,
        preparationSteps
      };
  
      return recipeDetails;
    } catch (error) {
      console.error('Erreur lors du scraping de la recette :', error);
      return null;
    }
  }
  
  export default scrapeUrl;