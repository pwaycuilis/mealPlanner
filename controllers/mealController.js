const fetch = require("node-fetch");
const Food = require("../models/food");
const Meal =  require('../models/meal')
const Nutrient = require('../models/nutrient');
const res = require("express/lib/response");



const { nutrientSort} = require("../middleware/helpers");

async function addToNewMeal (req, res, next) {

    let grams = req.query.grams;

    grams = grams ? grams : 100;

    let data = res.data;

    
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

    try{
        await meal.save();
        res.meal = meal;  
    } catch(err){
        return res.status(500).json({ message: err.message});
    }
    
    next();



}
async function addItemToMeal (req, res, next) {
    const grams = req.query.grams ? req.query.grams : 100;
    let data = res.data;


    let food = new Food({
        //fdcId set to 0 for custom foods
        fdcId: data.fdcId ? data.fdcId : 0,
        description: data.description,
        amountInGrams: grams
    })

    let meal = res.meal;

    /////



    ///
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

    

        await meal.save();
        return meal;

    } catch (err){
        return false;
    }
}

async function deleteFoodFromMeal (req, res, next) {

    let meal = res.meal;

    let food

    food = meal.foods.find(item => item.id === req.params.foodId);


    if (food == null) {
        return res.status(404).json({message: "foodId not found"});
    }

    meal.nutrientTotals.forEach(function(item) {

        let nutrient = food.foodNutrients.find(element => element.number === item.number);
        item.amount -= nutrient.amount;
        item.amount = +item.amount.toFixed(2);
    })

    try {
        await meal.save();
        await Meal.updateOne({"_id": req.params.mealId},
        {
            "$pull": {
                "foods": {
                    "_id": req.params.foodId
                }
            }
        });
    } catch(err){
        return({message: err.message});

    }

    res.food = food;
    res.meal = await Meal.findById({"_id": req.params.mealId});

    next();
}

module.exports = {
    addToNewMeal,
    addItemToMeal,
    addTotalsToMeal,
    deleteFoodFromMeal
}