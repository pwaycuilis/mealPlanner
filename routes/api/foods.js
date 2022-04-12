
const express = require("express");
const res = require("express/lib/response");
const { append } = require("express/lib/response");
const router = express.Router();
const { restart } = require("nodemon");

const Meal = require('../../models/meal');
const Food = require('../../models/food');
const Nutrient = require('../../models/nutrient');
// const Portion = require('../../models/food');

const {getMeal, getData, getFood, getPortions, searchBrandItem, searchByFdcId, simpleSearch, listData, getMultiple, compareToDV} = require("../../middleware/helpers");
const {addToNewMeal, addItemToMeal, deleteFoodFromMeal} = require('../../controllers/mealController');

const fdcDatabase = 'https://api.nal.usda.gov/fdc/v1/foods/'
const api_key = 'mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9';
// const mineralIds = '301,303,304,305,306,307,309';
// const traceElementIds = '311,312,314,315,316,317,354';
// const vitaminIds = '319,320,321,322,323,324,325,326,327,328,428,429,430,404,405,406,410,415,416,417,418,421,450';

const dailyValues = require('../../models/DailyValues');
const { find } = require("../../models/nutrient");


router.get('/dailyValues', async(req, res, next) => {

    res.json(dailyValues);

})

router.get('/meals/compareToDV/:mealId', getMeal, compareToDV, async (req, res) => {
    
    res.json(res.dailyValues);

})

router.get('/searchMultiple', getMultiple, async (req, res) => {


    res.json(res.data);
    //parameters
    // dataType, pageSize, pageNumber, sortBy, sortOrder
  

});

router.get('/list', listData, async (req, res) => {
    // let foodData = await listData();
    // res.json(foodData);

    res.status(200).json(res.data);
})


router.get('/meals/:mealId?', getMeal, async (req, res) => {

    res.json(res.meal);

})

router.get('/customFoodList', async (req, res) => {

    try {
        food = await Food.find();
        res.json(food);
    } catch(err) {
        return ({message: err.message});
    }
    //res.json(res.meal);

})


router.get('/searchForId', async (req, res) => {


    // const foundation = 'Foundation';
    // const survey = 'Survey%20%28FNDDS%29';
    // const legacy = 'SR%20Legacy';
    // const branded = 'Branded';

    let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.query.query}&dataType=Foundation,Survey%20%28FNDDS%29,SR%20Legacy&api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9`

    let data = await simpleSearch(url);

    // res.json(items);
    res.json(data);

})

router.get('/searchById/:fdcId', searchByFdcId, async(req, res) => {

    res.json(res.data);

})


router.get('/searchPortionSizes/:fdcId', getPortions, async(req, res) => {

    res.json(res.portions);
})




router.post('/addToNewMeal/:fdcId', searchByFdcId, addToNewMeal, async (req, res) => {

    res.status(201).json(res.meal);
        
})

router.post('/addToMeal/:mealId/:fdcId', getMeal, searchByFdcId, addItemToMeal, async (req, res, next) =>{
   
    res.status(201).json(res.meal);
})


// router.post('/addMultipleFoods', async(req, res, next) =>{

// })


router.delete('/deleteFoodFromMeal/:mealId/:foodId', getMeal, deleteFoodFromMeal, async (req, res) => {

    res.status(200).json(res.meal);
})


router.delete('/deleteMeal/:mealId', getMeal, async (req, res) => {
    
    try{
        
        await res.meal.remove()
        res.json({message: `deleted meal ${req.params.mealId}`});
        
    } catch (err) {
        res.status(500).json({message: err.message });
    }
    
})

router.patch('/meal/:mealId', async (req, res) => {
    try {
        const updateInfo = await Meal.updateOne({ _id: req.params.mealId }, 
            { $set: {description: req.body.description } }); 
        updatedMeal = await Meal.findById({_id: req.params.mealId});
        res.status(200).json(updatedMeal)
    }
    catch (err) {
        res.json({message: err.message});
    }
})

router.get('/fullSearch', async (req, res) => {
    
    // let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.query.query}&dataType=Foundation&api_key=${api_key}`
    let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.query.query}&dataType=Foundation,Survey%20%28FNDDS%29,Branded&api_key=${api_key}`
    const data = await getData(url);


    res.json(data);
});



router.get('/searchMacros/:id', async(req, res) => {

    let nutrientIds = '208,255,601,203,307,204,606,645,646,205,209,291,269,'
    let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9&format=abridged&nutrients=${nutrientIds}`;


    // let data = await searchByFdcId(url);
    let data = await getData(url);

    res.json(data);
});

router.get('/searchMicros/:id', async(req, res) => {
    let minerals = '301,303,304,305,306,307,309';

    let traceElements = '311,312,314,315,316,317,354';
    
    let vitamins = '319,320,321,322,323,324,325,326,327,328,428,429,430,404,405,406,410,415,416,417,418,421,450'

    //caffeine nutrientId = 262
    let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=${api_key}&nutrients=${vitamins}&format=abridged`

    // let data = await searchByFdcId(url);
    let data = await getData(url);

    res.json(data);
})


router.get('/post', async (req, res) => {
    let foodData = await postData();
    res.json(foodData);
});


router.get('/searchBrandItem', async (req, res) => {
    // let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.query.query}&dataType=Branded&api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9`
    let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.query.query}&dataType=Foundation,Survey%20%28FNDDS%29,SR%20Legacy,Branded&api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9`
    let data = [];

    let items = await searchBrandItem(data, url);

    res.json(items);

})

router.post('/createCustomFood', async (req, res) => {
    let food = new Food ({

        description: req.body.description,

    });

    req.body.foodNutrients.forEach(function(item) {
        let nutrient = new Nutrient ({
            number: item.number,
            name: item.name,
            amount: item.amount,
            unitName: item.unitName
        });
        food.foodNutrients.push(nutrient);

    });
    try {
        const newFood = await food.save();
        res.status(201).json(newFood);
    } catch (err) {
        res.status(400).json({message: error.message})
    }
})

router.delete('deleteCustomFood', getFood, async (req, res) => {

    try {
        await res.data.remove();
    } catch(err){
        res.status(500).json({message: err.message});
    }
})

router.post('/addCustomFoodToMeal/:mealId/:foodId', getMeal, getFood, addItemToMeal, async(req, res) => {
    
    res.json(res.meal);
    
})


module.exports = router;