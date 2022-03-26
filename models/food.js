const mongoose = require('mongoose');
const nutrientSchema = require('./nutrient').schema;



const foodSchema = new mongoose.Schema({
    
    fdcId: Number,
    description: String,
    dataType: String,
    publicationDate: String,
    ndbNumber: String,
    amountInGrams: {
        type: Number,
        default: 100,
    },
    foodNutrients: [nutrientSchema]
    
    

})

// const mealSchema = new mongoose.Schema({

//     children: [foodSchema],
// })

module.exports = mongoose.model('Food', foodSchema)
// module.exports = mongoose.model('Nutrient', nutrientSchema)