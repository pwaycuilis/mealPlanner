const fetch = require("node-fetch");
const Food = require("../models/food");
const Meal =  require('../models/meal')
const Nutrient = require('../models/nutrient');
const res = require("express/lib/response");
const dailyValues = require('../models/DailyValues');

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

async function getFood (req, res, next) {

    if (!req.params.foodId){
        return res.status(500).json({message: "foodid required"});
    }

    let food
    try {
        //does not find food id if only embedded in meal
        //only finds custom created foods
        food = await Food.findById({_id: req.params.foodId});    
    } catch(err){
        console.log(err);
        return res.status(500).json({message: err.message});
    }

    console.log("food from getFood", food);

    res.data = food;

    console.log("res.data from getFood", res.data);
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

        return ({ message: err.message});
    }
    
}

async function getPortions (req, res, next) {
    const fdcId = req.params.fdcId;
    let url = `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${api_key}`;

    let data;
    try{
        data = await getData(url);
        if (data === 404){
            return res.status(404).json({"message": "invalid URL or fdcId"})
        }

    }catch(err){
        return({message: err.message});

    }


    let portions = new Object({
        fdcId: data.fdcId,
        description: data.description,
        portionSizes: data.foodPortions ? data.foodPortions : {message: "portion sizes not available for item"}
    });

    res.portions = portions;
    next();

    
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

    }catch(err){
        console.log({message: err.message});
        return ({message: err.message});
    }



    res.data = data;
    next();

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



async function getMultiple(req, res, next) {
    let format = req.query.format ? format : "abridged";
    
    let pageSize = req.query.pageSize ? req.query.pageSize : 25;
    let pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
    let fdcIds = req.query.fdcIds;


    let defaultNutrientIds = '208,255,204,205,203,291,269,301,303,304,305,306,307,309,401,601,606,645,646' // added vitamin c
    const nutrientIds = req.query.nutrientIds ? req.query.nutrientIds : defaultNutrientIds;

    // let url = `https://api.nal.usda.gov/fdc/v1/foods?api_key=${api_key}&fdcIds=${fdcIds}&nutrients=${nutrientIds}&format=${format}&pageSize=${pageSize}&pageNumber=${pageNumber}`;\
    let url = `https://api.nal.usda.gov/fdc/v1/foods?api_key=${api_key}&fdcIds=${fdcIds}&nutrients=${nutrientIds}&format=${format}`;

    let data
    try {
        data = await getData(url);

    }catch(err){
        console.log({message: err.message});
        return ({message: err.message});
    }

    res.data = data;
    next();

}


async function searchByFdcId(req, res, next) {

    const fdcId = req.params.fdcId;
  
    let defaultNutrientNums = '208,255,204,205,203,291,269,301,303,304,305,306,307,309,401,601,606,645,646' // added vitamin c
    // const nutrientIds = req.query.nutrientIds ? req.query.nutrientIds : defaultNutrientIds;
    const nutrientNums = req.query.nutrientNums ? req.query.nutrientNums : defaultNutrientNums;
    // const format = req.query.format ? req.query.format : "abridged";
    let url = `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9&format=abridged&nutrients=${nutrientNums}`

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
    
    let food = data.foods.map(ele => new Object({ fdcId: ele.fdcId, description: ele.description }));



    console.log(food);
    return food;



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

module.exports = {
    getMeal,
    getData,
    getFood,
    getPortions,
    postData,
    listData,
    searchByFdcId,
    simpleSearch,
    searchBrandItem,
    nutrientSort,
    getMultiple,
    compareToDV
}