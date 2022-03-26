
const express = require("express");
const res = require("express/lib/response");
const { append } = require("express/lib/response");
const router = express.Router();
const { restart } = require("nodemon");

const Meal = require('../../models/meal');

const {getData, searchBrandItem, searchByFdcId, searchId, searchNamesList, searchTest, listData, addItemToMeal, addToNewMeal, deleteFood} = require("../../middleware/helpers");

const fdcDatabase = 'https://api.nal.usda.gov/fdc/v1/foods/'
const api_key = 'mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9';


router.get('/', async (req, res) => {

    let url = 'https://api.nal.usda.gov/fdc/v1/foods/search?query=apple&pageSize=2&api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9'

    let foodData = await getData(url);

    res.json(foodData);
    // res.json(foodData.foods[0].foodNutrients);

    // res.status(200).json({"success": true});
});



router.get('/meals', async (req, res) => {

 
    try {
        const meals = await Meal.find()
        res.json(meals);

    } catch (err) {
        res.status(500).json({ message: err.message })

    }
    
})


router.post('/addToNewMeal/:fdcId', async (req, res, next) => {
    let nutrientIds = '208,255,204,205,203';
    let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.fdcId}?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9&format=abridged&nutrients=${nutrientIds}`

    const grams = req.query.grams;
    let mealId = await addToNewMeal(url, grams);

    

    // console.log( mealId );
    if (!mealId) {
        let fdcId = req.params.fdcId
        res.status(404).json({"error": `fdcId ${fdcId} not found`});
        return
    }
    
    try {
        const response = await Meal.findById({_id: mealId});
        console.log("response", response)
        res.status(201).json(response);
    }catch (err){
        res.status(500).json({ message: err.message })
    }
   
})

router.post('/addToMeal/:mealId/:fdcId', async (req, res, next) => {


    //fdcId is foodid
    let nutrientIds = '208,255,204,205,203';
    //606= sat fat, 645=monounsat, 646= polyunsat, 291 = dietary fiber, 269 total sugars
    let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.fdcId}?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9&format=abridged&nutrients=${nutrientIds}`

    ////////////
    const grams = req.query.grams;
    /////////////
    let mealId = req.params.mealId;
    // console.log("here")
    let valid = await addItemToMeal(url, mealId, grams);

    console.log("valid", valid);

    try{
        // console.log("in router try bracks");
        const meal = await Meal.findById({_id: mealId});
        res.status(201).json(meal);
    } catch(err){
        res.status(500).json({message: err.message});
    }
    // if (valid) {

    //     //was findOne

    //     // Meal.findById({_id: mealId}, function(err,docs){
    //     //     if (err){
    //     //         console.log(err);

    //     //     } else{
    //     //         res.status(201).json(docs);
    //     //     }
            
    //     // })

    //     // Meal.find({},function(err,docs){
    //     //     res.status(201).json(docs);
    //     // })
    // } else {
    //     res.status(400);
    // }
    
})

router.post('/addMultipleFoods', async(req, res, next) =>{

})

router.delete('/deleteFood/:mealId/:foodId', async (req, res, next) => {

    //food objId is diff from fdcId
    const mealId = req.params.mealId;
    const foodId = req.params.foodId;

    let meals = await deleteFood(mealId, foodId);

    try {
        console.log("in foods try bracks");
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
    let foodData = await getData(url);

    console.log(foodData.totalHits);
    console.log(foodData.foods.length);

    res.json(foodData);
});

router.get('/searchById/:id', async(req, res) => {

    

    let nutrientIds = '208,255,601,203,307,204,606,645,646,205,209,291,269,'
    let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=${api_key}&format=abridged`;
    // let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=${api_key}&format=abridged&nutrients=${nutrientIds}`;
 

    let data = [];

    // let foodInfo = await searchByFdcId(data, url);
    let foodInfo = await searchByFdcId(url);

    res.json(foodInfo);
});

router.get('/searchMacros/:id', async(req, res) => {

    let nutrientIds = '208,255,601,203,307,204,606,645,646,205,209,291,269,'
    let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9&format=abridged&nutrients=${nutrientIds}`;

    let data = [];

    let foodInfo = await searchByFdcId(data, url);

    res.json(foodInfo);
});

router.get('/searchMicros/:id', async(req, res) => {
    let minerals = '301,303,304,305,306,307,309';

    let traceElements = '311,312,314,315,316,317,354';
    
    let vitamins = '319,320,321,322,323,324,325,326,327,328,428,429,430,404,405,406,410,415,416,417,418,421,450'

    let url = `${fdcDatabase}${req.params.id}?api_key=${api_key}&nutrients=${vitamins}&format=abridged`

    let data = await searchByFdcId(url);
})

router.get('/searchCaffeine/:id', async(req, res) => {

    // let nutrientIds = '208,255,601,203,307,204,606,645,646,205,209,291,269,'
    let nutrientIds = '262';
    let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9&format=abridged&nutrients=${nutrientIds}`;

    let data = [];

    let foodInfo = await searchByFdcId(data, url);

    res.json(foodInfo);
})

router.get('/post', async (req, res) => {
    let foodData = await postData();
    res.json(foodData);
});

router.get('/list', async (req, res) => {
    let foodData = await listData();
    res.json(foodData);
})


//seraches foundation, survey and legacy
router.get('/searchNamesList', async (req, res) => {

    //console.log(req.query.query);

    //FOUNDATION = Foundation
    // let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.query.query}&dataType=Foundation&api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9`
    //SURVEY = Survey%20%28FNDDS%29
    // let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.query.query}&dataType=Survey%20%28FNDDS%29&api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9`
    //LEGACY = SR%20Legacy
    //BRANDED= Branded

    let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.query.query}&dataType=Foundation,Survey%20%28FNDDS%29,SR%20Legacy&api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9`

    let data = await searchTest(url);



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



async function getMeal(req, res, next) {
    let meal
    try {
        
        meal = await Meal.findById(req.params.mealId)

        if (meal == null) {
            return res.status(404).json({ message: 'Cannot find meal' })
        } 
    } catch (err) {
        // console.log("in getMeal catch ");
        // console.log("meal", meal);
        if (meal == null) {
            return res.status(404).json({ message: 'Cannot find meal' })
        }
        return res.status(500).json({ message: err.message });
    }

    res.meal = meal;
    next();
}

// router.get('/json-spec', async)

module.exports = router;