const mongoose = require('mongoose');
const foodSchema = require('.//food').schema;
const nutrientSchema = require('./nutrient').schema;
// const nutrientSchema = require('./food').schema;



const mealSchema = new mongoose.Schema({

    // _id: String,
    foods: [foodSchema],

    nutrientTotals: [nutrientSchema]
    
})



// module.exports = mongoose.model('Food', foodSchema)
module.exports = mongoose.model('Meal', mealSchema)