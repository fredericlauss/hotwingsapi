const mongoose = require('mongoose');

// Définition du schéma Recipe
const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  ingredients: {
    type: [String],
    required: true
  },
  steps: {
    type: [String],
    required: true
  }
});

// Création du modèle Recipe à partir du schéma
const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;