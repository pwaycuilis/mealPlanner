const meals = [
    {
        id: 1,
        foods: [
        {
            fdcId: 170903,
            name: "Yogurt, Greek, plain, lowfat",
            servingSize: "100g",
            foodNutrients: [
                {
                    //number: 208
                    name: "Energy",
                    amount: 73,
                    unitName: "KCAL",
                },
                {
                    //number: 255
                    name: "Water",
                    amount: 83.6,
                    unitName: "G",
                },
                {
                    //number: 204
                    name: "Total lipid (fat)",
                    amount: 1.92,
                    unitName: "G",

                },
                {
                    //number: 205
                    name: "Carbohydrate, by difference",
                    amount: 3.94,
                    unitName: "G",
                },
                
                
                {
                    //number:203
                    name: "Protein",
                    amount: 9.95,
                    unitName: "G",
                },
            ]

        },
        {
            fdcId: 748967,
            name: "Eggs, Grade A, Large, egg whole",
            servingSize: "100g",
            foodNutrients: [
                {
                    name: "Energy",
                    amount: 148,
                    unitName: "KCAL",

                },
                {
                    name: "Water",
                    amount: 75.8,
                    unitName: "G",
                },
                {
                    name: "Total lipid (fat)",
                    amount: 9.96,
                    unitName: "G",
                },
                {
                    name: "Carbohydrate, by difference",
                    amount: 0.96,
                    unitName: "G",
                },
                {
                    name: "Protein",
                    amount: 12.4,
                    unitName: "G",
                },
            ]

        }
        ],
        totalFat: 11.88,
        fatUnit: "G",
        totalCalories: 221,
        caloriesUnit: "KCAL",
        totalCarbs: 4.9,
        carbsUnit: "G",
        totalProtein: 22.35,
        proteinUnit: "G"

    },
    

];

module.exports = meals;