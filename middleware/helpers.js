const fetch = require("node-fetch");
const Food = require("../models/food");

const Meal =  require('../models/meal')
const Nutrient = require('../models/nutrient');

const res = require("express/lib/response");



const getData = async(url) => {
    //let url = 'https://api.nal.usda.gov/fdc/v1/foods/search?query=apple&pageSize=2&api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9'
    try {
        const response = await fetch(url);
        return response.json();
    } catch(err){
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

const listData = async() => {
    let url = 'https://api.nal.usda.gov/fdc/v1/foods/list/?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9'
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                "dataType": [
                  "Foundation",
                  "SR Legacy"
                ],
                "pageSize": 25,
                "pageNumber": 2,
                "sortBy": "dataType.keyword",
                "sortOrder": "asc"
              }
        )
    });
    return response.json();
};

const searchByFdcId = async (url) => {

    let data;
    data = await getData(url);

    let nutrients = [];

    let j = 0;



    for (let i = 0; i < data.foodNutrients.length; i++) {
        

        if (data.foodNutrients[i].amount !== 0){
            nutrients[j] = {
                name: data.foodNutrients[i].name,
                amount: data.foodNutrients[i].amount,
                unitName: data.foodNutrients[i].unitName

            }
            j++;
        }

        //if (data.foodNutrients)
        
    };

    // console.log("From searchById func:");
    // console.log(nutrients);
    //return nutrient;
    return data;

}

// const searchTest = async (data, url) => {
const searchTest = async ( url) => {
 
    // data = await getData(url);
    let data = await getData(url);
    let foodItem = [];


    for (let i = 0; i < data.foods.length; i++) {
        foodItem[i] = {
            fdcId: data.foods[i].fdcId,
            name: data.foods[i].description,
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

const addItemToMeal = async (url, mealId, grams) => {

    //const found = meals.some(meal => meal.id === parseInt(req.params.id));

    grams = grams ? grams : 100;

    // console.log("url from add func", url)
    
    // let nutrientIds = '208,255,204,205,203';
    // let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.fdcId}?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9&format=abridged&nutrients=${nutrientIds}`

    let foodInfo = [];

    let data = await searchByFdcId(foodInfo, url);


    
    let food = new Food({
        fdcId: data.fdcId,
        description: data.description,
        amountInGrams: grams,
    })
    

    
    
    let newTotal = 0;

    for(let i = 0; i < data.foodNutrients.length; i++) {
        let nutrient = new Nutrient({
            number: data.foodNutrients[i].number,
            name: data.foodNutrients[i].name,
            //amount: data.foodNutrients[i].amount;
            amount: data.foodNutrients[i].amount * (grams / 100),
            unitName: data.foodNutrients[i].unitName,
            // derivationCode: data.foodNutrients[i].derivationCode,
            // derivationDescription: data.foodNutrients[i].derivationDescription
        })


        nutrient.amount = +nutrient.amount.toFixed(2);

        food.foodNutrients.push(nutrient);
        let respon = await addTotalsToMeal(mealId, nutrient);

    }

    try{
        
        // console.log("in try bracks")

        let response = await Meal.findById({_id: mealId});
        response.foods.push(food);

        await response.save();


        return response;


    } catch (err){
        return ({message: err.message});
        //return false;
    }
    
}

const addTotalsToMeal = async(mealId, nutrient) => {
    let totals = [];


    try {
        let meal = await Meal.findById({_id: mealId});

        for(let i = 0; i < meal.nutrientTotals.length; i++) {
            if (meal.nutrientTotals[i].number === nutrient.number){
                
                meal.nutrientTotals[i].amount += nutrient.amount;
                meal.nutrientTotals[i].amount = +meal.nutrientTotals[i].amount.toFixed(2);
            }
        }

        meal.save();
        return true;

    } catch (err){
        return false;
    }
    

}

const addToNewMeal = async (url, grams) => {

    //const found = meals.some(meal => meal.id === parseInt(req.params.id));

    console.log("url from add func", url)

    grams = grams ? grams : 100;
    
    // let nutrientIds = '208,255,204,205,203';
    // let url = `https://api.nal.usda.gov/fdc/v1/food/${req.params.fdcId}?api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9&format=abridged&nutrients=${nutrientIds}`

    // let foodInfo = [];

    let data;
    try {
        data = await searchByFdcId( url);

    } catch(err){
        // return({message: err.message});
        // return({message: "invalid fdcId"})
        console.log({message: err.message});
        return false;
    }
    


    let food = new Food({
        fdcId: data.fdcId,
        description: data.description,
        amountInGrams: grams,
    })

    let meal = new Meal({});
    console.log("food pre loop", food);

    // tempName = data.foodNutrients.findIndex(item => item.number === "208")
    
    for(let i = 0; i < data.foodNutrients.length; i++) {
        let nutrient = new Nutrient({
            number: data.foodNutrients[i].number,
            name: data.foodNutrients[i].name,
            amount: data.foodNutrients[i].amount * (grams / 100),
            unitName: data.foodNutrients[i].unitName,
            // derivationCode: data.foodNutrients[i].derivationCode,
            // derivationDescription: data.foodNutrients[i].derivationDescription
        })
        nutrient.amount = +nutrient.amount.toFixed(2);

        food.foodNutrients.push(nutrient);
        
        meal.nutrientTotals.push(nutrient);
    }


    try{
              
        meal.foods.push(food);
        meal.save();
        
        let mealId = meal._id;

        const data = await Meal.find({_id: mealId});
        // console.log("from func", data);

        return mealId;


    } catch (err){
        console.log(err);
        return false;
    }

}

const deleteFood = async (mealId, foodId) => {


    const meals = await Meal.findById({"_id": mealId});

    // let nutrs = await Meal.foods.findById({"_id": foodId});

    // console.log("meals", meals);

    
    // console.log("foodId", foodId)
    for(let i = 0; i < meals.foods.length; i++) {
        console.log("meals.foods[i]._id", meals.foods[i].id)
        if (meals.foods[i].id === foodId) {
            nutrs = meals.foods[i];
            console.log("meals.foods[i]", meals.foods[i]);
            console.log("nutrs", nutrs);

        }
    }

    // console.log("nutrs", nutrs);
    // const nutrs = await Meal.find({
    //     'foods': {
    //         $elemMatch : {
    //             '_id' : foodId
    //         }
    //     }
    // })

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
    meals.save();


    return nutrs;
    

}

module.exports = {
    getData,
    postData,
    listData,
    searchByFdcId,
    searchTest,
    searchBrandItem,
    addItemToMeal,
    addToNewMeal,
    deleteFood
}