import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  preparationSteps: [String]
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;