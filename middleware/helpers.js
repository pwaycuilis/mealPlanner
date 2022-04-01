const fetch = require("node-fetch");
const Food = require("../models/food");
const Meal =  require('../models/meal')
const Nutrient = require('../models/nutrient');
const res = require("express/lib/response");

const api_key = 'mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9';

async function getMeal(req, res, next) {
    let meal
    if (req.params.mealId){
        try {
            meal = await Meal.findById({_id : req.params.mealId});
            
        }catch(err){
            if (meal == null) {
                return res.status(404).json({message : 'Cannot find meal(catch)'});
            }
            return res.status(500).json({message: err.message});
        }

    } else{
        try {
            meal = await Meal.find();
        }catch(err){
            return res.status(500).json({message: err.message});
        }
    }
    res.meal = meal;
    next();
    
}


const getData = async(url) => {
    
    try {
        const response = await fetch(url);
        console.log(response.status);

        if (response.status === 404){
            return response.status;
        }
        return response.json();
    } catch(err){
        // console.log("in getdata catch")
        // console.log({message: err.code});
        return ({ message: err.message});
    }
    
}

const postData = async() => {
    let url = 'https://api.nal.usda.gov/fdc/v1/foods/?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9'

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        
        body: JSON.stringify(
            {
                "fdcIds": [
                  534358,
                  //454005,   //apple
                  373052,
                  616350
                ],
                // "format": "abridged",
                "dataType": "unbranded",
                "nutrients": [
                  203,
                  204,
                  205
                ]
              }
        )
    });

    return response.json();
}

async function listData (req, res, next) {

    let format = req.query.format ? format : "unabridged";
    // let dataType = req.query.dataType ? req.query.dataType : "Foundation"
    let pageSize = req.query.pageSize ? req.query.pageSize : 25;
    let pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
    let url = `https://api.nal.usda.gov/fdc/v1/foods/list/?api_key=${api_key}&format=${format}&pageSize=${pageSize}&pageNumber=${pageNumber}`;
 

    let data
    try {
        data = await getData(url);
        // console.log("data", data);
    }catch(err){
        console.log({message: err.message});
        return ({message: err.message});
    }



    res.data = data;
    next();

}

async function getMultiple(req, res, next) {
    let format = req.query.format ? format : "abridged";
    // let dataType = req.query.dataType ? req.query.dataType : "Foundation"
    let pageSize = req.query.pageSize ? req.query.pageSize : 25;
    let pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
    let fdcIds = req.query.fdcIds;
    let url = `https://api.nal.usda.gov/fdc/v1/foods?api_key=${api_key}&fdcIds=${fdcIds}&format=${format}&pageSize=${pageSize}&pageNumber=${pageNumber}`;
    // let url = `https://api.nal.usda.gov/fdc/v1/foods/list/?api_key=${api_key}&dataType=${dataType}`;
    // let url = `https://api.nal.usda.gov/fdc/v1/foods/list/?api_key=${api_key}`;

    let data
    try {
        data = await getData(url);
        // console.log("data", data);
    }catch(err){
        console.log({message: err.message});
        return ({message: err.message});
    }



    res.data = data;
    next();

}
// const listData = async() => {
//     let url = 'https://api.nal.usda.gov/fdc/v1/foods/list/?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9'
//     const response = await fetch(url, {
//         method: "POST",
//         headers: {
//             'accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(
//             {
//                 "dataType": [
//                   "Foundation",
//                   "SR Legacy"
//                 ],
//                 "pageSize": 25,
//                 "pageNumber": 2,
//                 "sortBy": "dataType.keyword",
//                 "sortOrder": "asc"
//               }
//         )
//     });
//     return response.json();
// };

async function searchByFdcId(req, res, next) {

    const fdcId = req.params.fdcId;
    console.log("req.params.fdcId", fdcId);
    // let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=${api_key}&format=abridged`;
    let defaultNutrientIds = '208,255,204,205,203,291,269,301,303,304,305,306,307,309,606,645,646'

    const nutrientIds = req.query.nutrientIds ? req.query.nutrientIds : defaultNutrientIds;
    // const format = req.query.format ? req.query.format : "abridged";
    let url = `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9&format=abridged&nutrients=${nutrientIds}`

    let data;
    try{
        data = await getData(url);
        if (data === 404){
            return res.status(404).json({"message": "invalid URL or fdcId"})
        }

    }catch(err){
        return({message: err.message});

    }

    res.data = data;
    
    next();

}



const simpleSearch = async ( url) => {
 
    let data = await getData(url);
    let foodItem = [];


    for (let i = 0; i < data.foods.length; i++) {
        foodItem[i] = {
            fdcId: data.foods[i].fdcId,
            description: data.foods[i].description,
        }
    };

    console.log(foodItem);

    return foodItem;

}

const searchBrandItem = async (data, url) => {

    data = await getData(url);
    
    let foodItem = [];

    for (let i = 0; i < data.foods.length; i++) {
        foodItem[i] = {
            id: data.foods[i].fdcId,
            name: data.foods[i].description,
            brandOwner: data.foods[i].brandOwner,
            productName: data.foods[i].brandName,
            category: data.foods[i].foodCategory,
            servingSize: data.foods[i].servingSize,
            servingSizeUnit: data.foods[i].servingSizeUnit,
            packageWeight: data.foods[i].packageWeight

        }
    };
    return foodItem;
}



async function addToNewMeal (req, res, next) {

    let grams = req.query.grams;

    grams = grams ? grams : 100;

    let data = res.data;
    // let data = res.locals.data;
    // let grams = res.locals.grams;

   
    console.log("grams", grams);
    console.log("data", data);
    
    let food = new Food({
        fdcId: data.fdcId,
        description: data.description,
        amountInGrams: grams,
    })

    let meal = new Meal({});

    /////////TESTING SORT
    nutrientSort(data.foodNutrients);

    /////
    data.foodNutrients.forEach(function(item){
        let nutrient = new Nutrient({
            number: item.number,
            name: item.name,
            amount: item.amount * (grams / 100),
            unitName: item.unitName,
        })
        nutrient.amount = +nutrient.amount.toFixed(2);
        food.foodNutrients.push(nutrient);
        meal.nutrientTotals.push(nutrient);
        
    });


    meal.foods.push(food);
    // await meal.save();
    try{
        await meal.save();
        res.meal = meal;  
    } catch(err){
        return res.status(500).json({ message: err.message});
    }
    
    // console.log("meal from add", meal);
    next();



}
async function addItemToMeal (req, res, next) {
    const grams = req.query.grams ? req.query.grams : 100;
    let data = res.data;


    let food = new Food({
        fdcId: data.fdcId,
        description: data.description,
        amountInGrams: grams
    })

    let meal = res.meal;

    // this method not updating totals before response ?
    // data.foodNutrients.forEach(async function(ele){
    //     let nutrient = new Nutrient({
    //         number: ele.number,
    //         name: ele.name,
    //         amount: ele.amount * (grams / 100),
    //         unitName: ele.unitName
    //     })

    //     nutrient.amount = +nutrient.amount.toFixed(2);
    //     food.foodNutrients.push(nutrient);
    //     meal = await addTotalsToMeal(meal._id, nutrient)
    // })
    for(let i = 0; i < data.foodNutrients.length; i++) {
        let nutrient = new Nutrient({
            number: data.foodNutrients[i].number,
            name: data.foodNutrients[i].name,
            amount: data.foodNutrients[i].amount * (grams / 100),
            unitName: data.foodNutrients[i].unitName,

        })
        nutrient.amount = +nutrient.amount.toFixed(2);

        food.foodNutrients.push(nutrient);
        
        meal = await addTotalsToMeal(meal._id, nutrient);
    }

    meal.foods.push(food);
    await meal.save();
    res.meal = meal;
    console.log("res.meal from func", res.meal);
    next();
}



const addTotalsToMeal = async(mealId, nutrient) => {

    try {
        let meal = await Meal.findById({_id: mealId});

        for(let i = 0; i < meal.nutrientTotals.length; i++) {
            if (meal.nutrientTotals[i].number === nutrient.number){
                
                meal.nutrientTotals[i].amount += nutrient.amount;
                meal.nutrientTotals[i].amount = +meal.nutrientTotals[i].amount.toFixed(2);
            }
        }
        // meal.save();
        // return true;
        
        await meal.save();
        return meal;

    } catch (err){
        return false;
    }
}


const deleteFood = async (mealId, foodId) => {

    const meals = await Meal.findById({"_id": mealId});

    // let nutrs = await Meal.foods.findById({"_id": foodId});

    for(let i = 0; i < meals.foods.length; i++) {
        if (meals.foods[i].id === foodId) {
            nutrs = meals.foods[i];
        }
    }

    for(let i = 0; i < meals.nutrientTotals.length; i++){
       
        for(let j = 0; j < nutrs.foodNutrients.length; j++){
            if (meals.nutrientTotals[i].number === nutrs.foodNutrients[j].number){
                meals.nutrientTotals[i].amount -= nutrs.foodNutrients[j].amount;
                meals.nutrientTotals[i].amount = +meals.nutrientTotals[i].amount.toFixed(2);
                // Math.round(num * 100) / 100
                //Math.round((num + Number.EPSILON) * 100) / 100
            }
        }
    }
    await meals.save();


    return nutrs;

}



const nutrientSort = async (nutrients, sortBy, dir) => {

    const sorter = sortBy ? sortBy : "number";
    const direction = dir ? dir : "asc";

    if (direction == "desc") {
        nutrients.sort((a,b) => (b[sorter] > a[sorter]) ? 1 : -1);
    } else if (direction == "asc") {
        nutrients.sort((a, b) => (a[sorter] > b[sorter]) ? 1 : -1);
    } else {
        console.log(`${direction} is not a valid direction parameter`);
        //return
    }

    return nutrients;
    
}

module.exports = {
    getMeal,
    getData,
    postData,
    listData,
    searchByFdcId,
    simpleSearch,
    searchBrandItem,
    addItemToMeal,
    addToNewMeal,
    deleteFood,
    nutrientSort,
    getMultiple
}