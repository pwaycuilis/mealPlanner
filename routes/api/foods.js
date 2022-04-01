
const express = require("express");
const res = require("express/lib/response");
const { append } = require("express/lib/response");
const router = express.Router();
const { restart } = require("nodemon");

const Meal = require('../../models/meal');

const {getMeal, getData, searchBrandItem, searchByFdcId, searchId, searchNamesList, simpleSearch, listData, addItemToMeal, addToNewMeal, deleteFood, nutrientSort, getMultiple} = require("../../middleware/helpers");

const fdcDatabase = 'https://api.nal.usda.gov/fdc/v1/foods/'
const api_key = 'mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9';

const dailyValues = require('../../DailyValues');

async function compareToDV (req, res, next){

    let compareObj = res.meal.nutrientTotals;
    dailyValues.forEach(function(ele){
        compareObj.forEach(function(item){
            if (ele.name === item.name){
                ele.mealAmount = item.amount;
                ele.percentOfDV = (ele.mealAmount / ele.dailyAmount)
                ele.percentOfDV = +ele.percentOfDV.toFixed(2);
            }

        })
    })

    res.dailyValues = dailyValues;
    next();

}

router.get('/dailyValues', async(req, res, next) => {

    res.json(dailyValues);

})

router.get('/meals/compareToDV/:mealId', getMeal, compareToDV, async (req, res) => {
    
    console.log(res.dailyValues);
    res.json(res.dailyValues);

})

router.get('/searchMultiple', getMultiple, async (req, res) => {


    res.json(res.data);
    //parameters
    // dataType, pageSize, pageNumber, sortBy, sortOrder
  

    // let url = `https://api.nal.usda.gov/fdc/v1/foods/?api_key=${api_key}&fdcIds=${req.query.fdcIds}&format=abridged&nutrients=${nutrientIds}`
    //let url = 'https://api.nal.usda.gov/fdc/v1/foods/search?query=apple&pageSize=2&api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9'



    // let foodData = await getData(url);

    // res.json(foodData);

});

router.get('/list', listData, async (req, res) => {
    // let foodData = await listData();
    // res.json(foodData);

    res.status(200).json(res.data);
})


router.get('/meals/:mealId?', getMeal, async (req, res) => {

    res.json(res.meal);

})


router.get('/searchById/:fdcId', searchByFdcId, async(req, res) => {

    res.json(res.data);
    // res.json(res.locals.data);
})

router.get('/searchNutrients/:fdcId', )


router.post('/addToNewMeal/:fdcId', searchByFdcId, addToNewMeal, async (req, res) => {

    res.status(201).json(res.meal);
     
   
})



router.post('/addToMeal/:mealId/:fdcId', getMeal, searchByFdcId, addItemToMeal, async (req, res, next) =>{

   
    res.status(201).json(res.meal);
})



router.post('/addMultipleFoods', async(req, res, next) =>{

})


router.delete('/deleteFood/:mealId/:foodId', async (req, res, next) => {

    //food objId is diff from fdcId
    const mealId = req.params.mealId;
    const foodId = req.params.foodId;

    let meals = await deleteFood(mealId, foodId);

    try {
        // const meal = await Meal.updateOne({"_id": mealId},
        await Meal.updateOne({"_id": mealId},
        {
            "$pull": {
                "foods": {
                    "_id": foodId
                }
            }
        });
        const meal = await Meal.findById({"_id": mealId});
        res.json(meal);
    } catch(err) {
        res.status(500).json({message: err.message});
    }
    
});

router.delete('/deleteMeal/:mealId', getMeal, async (req, res) => {
    
    try{
        
        await res.meal.remove()
        res.json({message: `deleted meal ${req.params.mealId}`});
        
        // await Meal.findOneAndDelete({_id: mealId});
        // res.json({message: `deleted meal ${mealId}`});
    } catch (err) {
        res.status(500).json({message: err.message });
    }
    
})


router.get('/fullSearch', async (req, res) => {
    
    let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.query.query}&dataType=Foundation&api_key=${api_key}`
    // let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.query.query}&dataType=Survey&api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9`
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

    let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=${api_key}&nutrients=${vitamins}&format=abridged`

    // let data = await searchByFdcId(url);
    let data = await getData(url);

    res.json(data);
})

router.get('/searchCaffeine/:id', async(req, res) => {

    // let nutrientIds = '208,255,601,203,307,204,606,645,646,205,209,291,269,'
    let nutrientIds = '262';
    let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9&format=abridged&nutrients=${nutrientIds}`;


    // let data = await searchByFdcId(url);
    let data = await getData(url);

    res.json(data);
})

router.get('/post', async (req, res) => {
    let foodData = await postData();
    res.json(foodData);
});



router.get('/searchForId', async (req, res) => {


    //FOUNDATION = Foundation
    // let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.query.query}&dataType=Foundation&api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9`
    //SURVEY = Survey%20%28FNDDS%29
    // let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.query.query}&dataType=Survey%20%28FNDDS%29&api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9`
    //LEGACY = SR%20Legacy
    //BRANDED= Branded

    let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.query.query}&dataType=Foundation,Survey%20%28FNDDS%29,SR%20Legacy&api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9`

    let data = await simpleSearch(url);

    // res.json(items);
    res.json(data);

})



router.get('/searchBrandItem', async (req, res) => {
    // let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.query.query}&dataType=Branded&api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9`
    let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.query.query}&dataType=Foundation,Survey%20%28FNDDS%29,SR%20Legacy,Branded&api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9`
    let data = [];

    let items = await searchBrandItem(data, url);

    res.json(items);

})


module.exports = router;