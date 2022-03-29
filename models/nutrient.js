const mongoose = require('mongoose');
const dailyValues = require('../DailyValues');

const nutrientSchema = new mongoose.Schema({
   
    number: String,
    name: String,
    amount: Number,
    unitName: String,
    derivationCode: String,
    derivationDescription: String
}, {_id: false });

// nutrientSchema.virtual('dailyValue').get(function() {
//     return 
// })

module.exports = mongoose.model('Nutrient', nutrientSchema)