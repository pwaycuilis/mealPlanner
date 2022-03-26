const mongoose = require('mongoose');


// const macroSchema = new mongoose.Schema({
//     fat: {
//         amount: {
//             type: Number,
//             required: true
//         },
//         unit: {
//             type: String,
//             required: true
//         }
//     },
//     carbohydrates: {
//         amount: {
//             type: Number,
//             required: true
//         },
//         unit: {
//             type: String,
//             required: true
//         }
//     },
//     protein: {
//         amount: {
//             type: Number,
//             required: true
//         },
//         unit: {
//             type: String,
//             required: true
//         }
//     }

// })

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

})

module.exports = mongoose.model('Food', foodSchema)