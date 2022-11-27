require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');


exports.homepage = async(req, res) => {

   try {
const limitNumber = 5;
const categories = await Category.find({}).limit(limitNumber);
const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);

const food = {latest}

      res.render('index', { title: 'Cooking Blog - Home', categories, food});
   } catch (error) {
      res.status(500).send({ message: error.message || 'Error occurred while retrieving recipes.' });
   }
  
};



//get categories

exports.exploreCategories = async(req, res) => {

   try {
const limitNumber = 20;
const categories = await Category.find({}).limit(limitNumber);


      res.render('categories', { title: 'Cooking Blog - Categories', categories });
   } catch (error) {
      res.status(500).send({ message: error.message || 'Error occurred while retrieving recipes.' });
   }
  
};

 