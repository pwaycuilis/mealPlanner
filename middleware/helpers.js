const fetch = require("node-fetch");
const Food = require("../models/food");
const Meal =  require('../models/meal')
const Nutrient = require('../models/nutrient');
const res = require("express/lib/response");


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
    //let url = 'https://api.nal.usda.gov/fdc/v1/foods/search?query=apple&pageSize=2&api_key=mDxmvhitceBL7z0dotECKMGuvpUJHfXuysOWCBL9'
    
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
    try{
        data = await getData(url);
        if (data === 404){
            return data;
        }
        
    }catch(err){
        console.log(err);
        console.log(err.status);
        // console.log("invalid url -- fdcId may be invalid");
        return({message: err.message});
        // return ({message: err.message});

    }
    
    let nutrients = [];

    let j = 0;


    // console.log("data", data)

    for (let i = 0; i < data.foodNutrients.length; i++) {
        

        if (data.foodNutrients[i].amount !== 0){
            nutrients[j] = {
                name: data.foodNutrients[i].name,
                amount: data.foodNutrients[i].amount,
                unitName: data.foodNutrients[i].unitName

            }
            j++;
        }
    };
    return data;

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

// const getNutrients = async(url, mealId, grams) => {

//     grams = grams ? grams : 100;

//     let data
//     try {
//         data = await searchByFdcId( url);
//         if (data === 404){
//             return data;
//         }

//     } catch(err){
//         console.log({message: err.message})
//         return({message: err.message});
        
//     }

//     let food = new Food({
//         fdcId: data.fdcId,
//         description: data.description,
//         amountInGrams: grams,
//     })

//     let meal
//     if (!mealId){
//         meal = new Meal({});
//     } else {
//         try{
//             meal = Meal.findById({_id: mealId})
//         } catch(err){
//             console.log(err);
//             return ({message: err.message});
//         }
//     }

//     for(let i = 0; i < data.foodNutrients.length; i++) {
//         let nutrient = new Nutrient({
//             number: data.foodNutrients[i].number,
//             name: data.foodNutrients[i].name,
//             amount: data.foodNutrients[i].amount * (grams / 100),
//             unitName: data.foodNutrients[i].unitName,

//         })
//         nutrient.amount = +nutrient.amount.toFixed(2);
//         food.foodNutrients.push(nutrient);
//         //
//         if (!mealId) {
//             meal.nutrientTotals.push(nutrient);
//         } else{
//             await addTotalsToMeal(mealId, nutrient);
//         }
        
//     }

    // try{
    //     meal.foods.push(food);
    //     // if (!meal)
    //     await meal.save();
    //     if (!mealId){
    //         mealId = meal._id;
    //     }
    //     return mealId;
         

//     }catch(err){
//         return ({message: err.message});
//     }


// }

const addItemToMeal = async (url, mealId, grams) => {

    //const found = meals.some(meal => meal.id === parseInt(req.params.id));
    grams = grams ? grams : 100;

    let data
    try{
        data = await searchByFdcId(url);
        if (data === 404){
            return data;
        }
        
    }catch(err){
        console.log(err)
        return false;
    }
    
    let food = new Food({
        fdcId: data.fdcId,
        description: data.description,
        amountInGrams: grams,
    })
    

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
        let response = await Meal.findById({_id: mealId});
        response.foods.push(food);
        await response.save();
        return response;


    } catch (err){
        return ({message: err.message});
    }
}


const addToNewMeal = async (url, grams) => {

    //const found = meals.some(meal => meal.id === parseInt(req.params.id));
    grams = grams ? grams : 100;

    let data;
    try {
        data = await searchByFdcId( url);
        if (data === 404){
            return data;
        }

    } catch(err){
        console.log({message: err.message})
        return({message: err.message});
        
    }
    


    let food = new Food({
        fdcId: data.fdcId,
        description: data.description,
        amountInGrams: grams,
    })

    let meal = new Meal({});
    // console.log("food pre loop", food);

    for(let i = 0; i < data.foodNutrients.length; i++) {
        let nutrient = new Nutrient({
            number: data.foodNutrients[i].number,
            name: data.foodNutrients[i].name,
            amount: data.foodNutrients[i].amount * (grams / 100),
            unitName: data.foodNutrients[i].unitName,

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
        return mealId;


    } catch (err){
        console.log(err);
        return false;
    }

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
        meal.save();
        return true;

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
    meals.save();


    return nutrs;

}

const nutrientSort = async () => {

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
    deleteFood
}