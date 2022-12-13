require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.homepage = async(req, res) => {

   try {
const limitNumber = 5;
const categories = await Category.find({}).limit(limitNumber);
const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
const thai = await Recipe.find({ category: 'Thai' }).limit(limitNumber);
const american = await Recipe.find({ category: 'American' }).limit(limitNumber);
const filipino = await Recipe.find({ category: 'Filipino' }).limit(limitNumber);
const chinese = await Recipe.find({ category: 'Chinese' }).limit(limitNumber);
const mexican = await Recipe.find({ category: 'Mexican' }).limit(limitNumber);
const indian = await Recipe.find({ category: 'Indian' }).limit(limitNumber);


const food = {latest, filipino, thai, american, chinese, mexican, indian};

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

//categories by id


exports.exploreCategoriesById = async(req, res) => {

   try {
      let categoryId = req.params.id;
const limitNumber = 20;
const categoryById = await Recipe.find({'category': categoryId}).limit(limitNumber);


      res.render('categories', { title: 'Cooking Blog - Categories', categoryById });
   } catch (error) {
      res.status(500).send({ message: error.message || 'Error occurred while retrieving recipes.' });
   }
  
};



//get Recipe with its ID

exports.exploreRecipe = async(req, res) => {

   try {
      let recipeId = req.params.id;
      const recipe = await Recipe.findById(recipeId);
      res.render('recipe', { title: 'Cooking Blog - Recipe', recipe });
   } catch (error) {
      res.status(500).send({ message: error.message || 'Error occurred while retrieving recipes.' });
   }
  
};

 

// post/search 



exports.searchRecipe = async(req, res) => {

   try {
      let searchTerm = req.body.searchTerm;
      let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
      

      res.render('search', { title: 'Cooking Blog - Search', recipe});
   } catch (error) {
      res.status(500).send({ message: error.message || 'Error occurred' });
   }
   
};



// explore latest




exports.exploreLatest = async(req, res) => {

   try {
      const limitNumber = 20;
      const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
      res.render('explore-latest', { title: 'Cooking Blog - Latest recipes', recipe });
   } catch (error) {
      res.status(500).send({ message: error.message || 'Error occurred while retrieving recipes.' });
   }
  
};

// random selection

exports.exploreRandom = async(req, res) => {

   try {
      
      let count = await Recipe.find().countDocuments();
      let random = Math.floor(Math.random() * count);
      let recipe = await Recipe.findOne().skip(random).exec();
     
      res.render('explore-random', { title: 'Cooking Blog - Latest recipes', recipe });
   } catch (error) {
      res.status(500).send({ message: error.message || 'Error occurred while retrieving recipes.' });
   }
  
};

// submit recipe


exports.submitRecipe = async(req, res) => {

   const infoErrorsObj = req.flash('infoErrors');
   const infoSubmitObj = req.flash('infoSubmit');
   res.render('submit-recipe', { title: 'Cooking Blog - submit', infoErrorsObj, infoSubmitObj });
}





// posting recipe

exports.submitRecipeOnPost = async(req, res) => {

   try {

      let imageUploadFile;
      let uploadPath;
      let newImageName;
  
      if(!req.files || Object.keys(req.files).length === 0){
        console.log('No Files where uploaded.');
      } else {
  
        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;
  
        uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
  
        imageUploadFile.mv(uploadPath, function(err){
          if(err) return res.satus(500).send(err);
        })
  
      }
  
      const newRecipe = new Recipe({
        name: req.body.name,
        description: req.body.description,
        email: req.body.email,
        ingredients: req.body.ingredients,
        category: req.body.category,
        image: newImageName
      });



   await newRecipe.save();
   req.flash('infoSubmit', 'Your recipe has been submitted successfully!');
   res.redirect('/submit-recipe');
 } catch (error) {
   res.json();
   req.flash('inforErrors', error);
res.redirect('/submit-recipe');

 }
}


exports.About = async(req, res) => {
   res.render('about', { title: 'Cooking Blog - About' });
}

exports.Contact = async(req, res) => {
   res.render('contact', { title: 'Cooking Blog - About' });
}


// register 

exports.register = async(req, res) => {
   const data = request.body;

   const encryptPassword = await bcrypt.hash(data.password, 10);

   const newUser = new User({
      name: data.name,
      email: data.email,
      password: encryptPassword
   });

   try{
   const response= await newUser.save();
   return response.status(201).json({
      message: 'User created successfully',
      data: response
   });
   } catch (error) {
      return response.status(500).json({
         message: 'There was an error',
         error
   });
}

}

//login 


exports.login = async(req, res) => {
  const data = request.body;

  let foundUser = User.findOne({ email: data.email});

  if (foundUser) {
const matchPassword = await bcrypt.compare(data.password, foundUser.password);
if (matchPassword) {
   return response.status(200).json({
      message: 'User logged in successfully',
      data: foundUser
   });

} else {
   return response.status(401).json({
      message: 'Wrong password',
      data: null
   });
}
  } else {
     return response.status(404).json({
        message: 'User not found',
        data: null
     });
  }
}