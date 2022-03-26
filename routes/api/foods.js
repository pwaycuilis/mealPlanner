const { response } = require("express");
const express = require("express");
const res = require("express/lib/response");
const { append } = require("express/lib/response");
const router = express.Router();
const fetch = require("node-fetch");
const { restart } = require("nodemon");
//const { addItemToMeal } = require("../../helpers");

const meals = require('../../Meals');

const getData = require("../../helpers").getData;
const searchBrandItem = require("../../helpers").searchBrandItem;
const searchById = require("../../helpers").searchById;
const searchId = require("../../helpers").searchId;
const searchNamesList = require("../../helpers").searchNamesList;
const searchTest = require("../../helpers").searchTest;
const listData = require("../../helpers").listData;
const addItemToMeal = require("../../helpers").addItemToMeal;
//const api_key = 'mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9';

//fdcId = 454004 //apple

//url = 'https://api.nal.usda.gov/fdc/v1/food/454005/?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9'
//get for single item /v1/food/{fcdId}


//my API    /search
//localhost:5000/api/foods/search/?query=banana

//  searchId/:id
//localhost:5000/api/foods/search/1102653

// /post    requires parameters etc
//



router.get('/', async (req, res) => {

    let url = 'https://api.nal.usda.gov/fdc/v1/foods/search?query=apple&pageSize=2&api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9'

    let foodData = await getData(url);

    // res.json(foodData.foods);
    res.json(foodData.foods[0].foodNutrients);

    //res.status(200).json({"success": true});
});



router.get('/meals', async (req, res) => {
    res.json(meals);
})

router.post('/meals/:id/:fdcId', async (req, res) => {
    
    const found = meals.some(meal => meal.id === parseInt(req.params.id));

    //let nutrientIds = '208,255,601,203,307,204,606,645,646,205,209,291,269,'
    let nutrientIds = '208,255,204,205,203';
    let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.fdcId}?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9&format=abridged&nutrients=${nutrientIds}`

    let data = [];
    if (found) {
        await addItemToMeal(data, url);
    }


    // let foodInfo = [];

    // let data = await searchById(foodInfo, url);

    // console.log(data)
    // let newFood = {
    //     fdcId: req.params.fdcId,
    //     name: data.description,
    //     servingSize: "100g",
    //     foodNutrients: [
    //         {   //208
    //             name: "Energy",
    //             amount: 0,
    //             unit: "KCAL",

    //         },
    //         {   //255
    //             name: "Water",
    //             amount: 0,
    //             unit: "G",

    //         },
    //         {   //204
    //             name: "Total lipid (fat)",
    //             amount: 0,
    //             unit: "G",

    //         },
    //         {   //205
    //             name: "Carbohydrate, by difference",
    //             amount: 0,
    //             unit: "G",

    //         },
    //         {   //203
    //             name: "Protein",
    //             amount: 0,
    //             unit: "G",

    //         }
    //     ]
    // };

    // for( let i = 0; i < data.foodNutrients.length; i++){
    //     if (data.foodNutrients[i].number === "208" ){
    //         newFood.foodNutrients[0].amount = data.foodNutrients[i].amount;
    //     }
    //     if (data.foodNutrients[i].number === "255" ){
    //         newFood.foodNutrients[1].amount = data.foodNutrients[i].amount;
    //     }
    //     if (data.foodNutrients[i].number === "204" ){
    //         newFood.foodNutrients[2].amount = data.foodNutrients[i].amount;
    //     }
    //     if (data.foodNutrients[i].number === "205" ){
    //         newFood.foodNutrients[3].amount = data.foodNutrients[i].amount;
    //     }
    //     if (data.foodNutrients[i].number === "203" ){
    //         newFood.foodNutrients[4].amount = data.foodNutrients[i].amount;
    //     }
        
    // }

    // if (found) {
    //     meals[0].foods.push(newFood)
    // }

    res.json(meals);
})

router.get('/search', async (req, res) => {
    
    let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.query.query}&dataType=Foundation&api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9`
    // let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.query.query}&dataType=Survey&api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9`
    let foodData = await getData(url);

    console.log(foodData.totalHits);
    console.log(foodData.foods.length);

    res.json(foodData);
});

router.get('/searchId/:id', async(req, res) => {

    // let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9&format=abridged`;

    let nutrientIds = '208,255,601,203,307,204,606,645,646,205,209,291,269,'
    let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9&format=abridged`;
    // let foodData = await getData(url);

    // res.json(foodData);

    let data = [];

    let foodInfo = await searchById(data, url);

    res.json(foodInfo);
});

router.get('/searchMacros/:id', async(req, res) => {

    let nutrientIds = '208,255,601,203,307,204,606,645,646,205,209,291,269,'
    let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9&format=abridged&nutrients=${nutrientIds}`;

    let data = [];

    let foodInfo = await searchById(data, url);

    res.json(foodInfo);
});

router.get('/searchMicros/:id', async(req, res) => {
    let minerals = '301,303,304,305,306,307,309';

    let traceElements = '311,312,314,315,316,317,354';
    
    let vitamins = '319,320,321,322,323,324,325,326,327,328,428,429,430,404,405,406,410,415,416,417,418,421,450'
})

router.get('/searchCaffeine/:id', async(req, res) => {

    // let nutrientIds = '208,255,601,203,307,204,606,645,646,205,209,291,269,'
    let nutrientIds = '262';
    let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9&format=abridged&nutrients=${nutrientIds}`;

    let data = [];

    let foodInfo = await searchById(data, url);

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
    let data = [];
    let items = await searchTest(data, url);

    console.log(items.totalHits);

    res.json(items);

    // let data = searchTest(req.query.query);

    // res.json(data);
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