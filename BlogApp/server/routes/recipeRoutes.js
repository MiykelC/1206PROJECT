const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');



router.get('/', recipeController.homepage);
router.get('/categories', recipeController.exploreCategories);
router.get('/recipe/:id', recipeController.exploreRecipe);
router.get('/categories/:id', recipeController.exploreCategoriesById);
router.post('/search', recipeController.searchRecipe);
router.get('/submit-recipe', recipeController.submitRecipe);
router.post('/submit-recipe', recipeController.submitRecipeOnPost);
router.get('/about', recipeController.About);
router.get('/contact', recipeController.Contact);
router.post("register", recipeController.register);
router.post("login", recipeController.login);


module.exports = router; 