
const express = require("express");
const res = require("express/lib/response");
const { append } = require("express/lib/response");
const router = express.Router();
const { restart } = require("nodemon");

const Meal = require('../../models/meal');

const {getMeal, getData, searchBrandItem, searchByFdcId, searchId, searchNamesList, simpleSearch, listData, addItemToMeal, addToNewMeal, deleteFood} = require("../../middleware/helpers");

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

router.get('/', async (req, res) => {

    let url = 'https://api.nal.usda.gov/fdc/v1/foods/search?query=apple&pageSize=2&api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9'

    let foodData = await getData(url);

    res.json(foodData);
    // res.json(foodData.foods[0].foodNutrients);

    // res.status(200).json({"success": true});
});


router.get('/meals/:mealId?', getMeal, async (req, res) => {

    res.json(res.meal);

})


router.get('/searchById/:fdcId', searchByFdcId, async(req, res) => {

    res.json(res.data);
    // res.json(res.locals.data);
})

// router.get('/searchById/:id', async(req, res) => {

//     let nutrientIds = '208,255,601,203,307,204,606,645,646,205,209,291,269,'
//     let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=${api_key}&format=abridged`;
//     // let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=${api_key}&format=abridged&nutrients=${nutrientIds}`;
 
//     try {
//         const data = await searchByFdcId(url);
//         // if (data == null) {
//         //     res.status(404).json("invalid fdcId");
//         // }
//         if (data === 404){
//             res.status(404).json({"message": "invalid URL or fdcId"})
//             return
//         }

//         res.json(data);
//     } catch(err){

//         console.log("err.status", err.status)
//         res.status(500).json({message: err.message});
//         return
//     }
    
// });

router.post('/addToNewMeal/:fdcId', searchByFdcId, addToNewMeal, async (req, res) => {
    

    //let mealId = data;

    res.status(201).json(res.meal);
    
    // try {
    //     const response = await Meal.findById({_id: mealId});
    //     console.log("response", response)
    //     res.status(201).json(response);
    // }catch (err){
    //     res.status(500).json({ message: err.message })
    // }
   
})

// router.post('/addToNewMeal/:fdcId', async (req, res, next) => {
//     // let nutrientIds = '208,255,204,205,203';
//     //301-307,309  Calcium, Iron, Magnesium, Phosphorous, Potassium, Sodium, Zinc
//     // let nutrientIds = '208,255,204,205,203,291,269' //added fiber and sugar
//     let nutrientIds = '208,255,204,205,203,291,269,301,303,304,305,306,307,309,606,645,646'
//     let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.fdcId}?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9&format=abridged&nutrients=${nutrientIds}`

//     const grams = req.query.grams;
    

//     let data
//     try {
//         data = await addToNewMeal(url, grams);
//         if (data === 404){
//             res.status(404).json({"message": "invalid URL or fdcId"})
//             return
//         }
//     }catch(err){
//         res.json({message: err.message});
//     }
    

//     // console.log( mealId );
//     // if (!mealId) {
//     //     let fdcId = req.params.fdcId
//     //     res.status(404).json({"error": `fdcId ${fdcId} not found`});
//     //     return
//     // }
//     let mealId = data;
    
//     try {
//         const response = await Meal.findById({_id: mealId});
//         console.log("response", response)
//         res.status(201).json(response);
//     }catch (err){
//         res.status(500).json({ message: err.message })
//     }
   
// })

router.post('/addToMeal/:mealId/:fdcId', getMeal, searchByFdcId, addItemToMeal, async (req, res, next) =>{

   
    res.status(201).json(res.meal);
})

// router.post('/addToMeal/:mealId/:fdcId', getMeal, async (req, res, next) => {


//     //fdcId is foodid
//     // let nutrientIds = '208,255,204,205,203';
//     let nutrientIds = '208,255,204,205,203,291,269,301,303,304,305,306,307,309,606,645,646';


//     //606= sat fat, 645=monounsat, 646= polyunsat, 291 = dietary fiber, 269 total sugars
//     let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.fdcId}?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9&format=abridged&nutrients=${nutrientIds}`


//     const grams = req.query.grams;
//     let mealId = req.params.mealId;

//     // let valid = await addItemToMeal(url, mealId, grams);

//     // if (!valid) {
//     //     res.status(404).json({"error": `fdcId ${req.params.fdcId} not found`})
//     //     return
//     // }
//     let data
//     try{
//         ////////////
//         data = await addItemToMeal(url, mealId, grams);
//         if (data === 404){
//             res.status(404).json({"message": "invalid URL or fdcId"})
//             return
//         }


//         //////////
//         const meal = await Meal.findById({_id: mealId});
//         res.status(201).json(meal);
//     } catch(err){
        
//         res.status(500).json({message: err.message});
//     }
    
    
// })

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


    let data = await searchByFdcId(url);

    res.json(data);
});

router.get('/searchMicros/:id', async(req, res) => {
    let minerals = '301,303,304,305,306,307,309';

    let traceElements = '311,312,314,315,316,317,354';
    
    let vitamins = '319,320,321,322,323,324,325,326,327,328,428,429,430,404,405,406,410,415,416,417,418,421,450'

    let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=${api_key}&nutrients=${vitamins}&format=abridged`

    let data = await searchByFdcId(url);

    res.json(data);
})

router.get('/searchCaffeine/:id', async(req, res) => {

    // let nutrientIds = '208,255,601,203,307,204,606,645,646,205,209,291,269,'
    let nutrientIds = '262';
    let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9&format=abridged&nutrients=${nutrientIds}`;


    let data = await searchByFdcId(url);

    res.json(data);
})

router.get('/post', async (req, res) => {
    let foodData = await postData();
    res.json(foodData);
});

router.get('/list', async (req, res) => {
    let foodData = await listData();
    res.json(foodData);
})

router.get('/searchNamesList', async (req, res) => {


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





// router.get('/json-spec', async)

module.exports = router;