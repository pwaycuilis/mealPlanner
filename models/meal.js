const mongoose = require('mongoose');


const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    calories: {
        amount: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        }
    },
    fat: {
        amount: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        }
    },
    carbohydrate: {
        amount: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        }
    },
    protein: {
        amount: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        }
    }

})

const mealSchema = new mongoose.Schema({

    children: [foodSchema],

    //child: 
})

module.exports = mongoose.model('Food', foodSchema)