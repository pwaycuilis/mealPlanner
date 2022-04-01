const mongoose = require('mongoose');
const foodSchema = require('.//food').schema;
const nutrientSchema = require('./nutrient').schema;




const mealSchema = new mongoose.Schema({

    //name: String,
    //date: 
    foods: [foodSchema],

    nutrientTotals: [nutrientSchema]
    
})




module.exports = mongoose.model('Meal', mealSchema)