# mealPlanner

README.TXT
--mealPlanner is an API that uses data from: 
U.S. Department of Agriculture, Agricultural Research Service. FoodData Central, 2019. fdc.nal.usda.gov.

| URL                         | Verb          | Purpose                                                                 |
| --------------------------- | ------------- | ----------------------------------------------------------------------- |
| /api/foods/list	      |	GET            | Returns paged list of foods (queries: format(string), pageSize(int), pageNumber(int) ) |
| /api/foods/meals/{mealId?}   | GET           | Returns data for the list of created meals or for a specific meal if mealId is specified|
| /api/foods/searchForId/  | GET           | Returns list of food descriptions and their fdcIds based on search (query) keywords  |
| /api/foods/searchById/{fdcId}| GET           | Fetches data for one specific food item based on fdcId   (optional query: nutrientNums)       |
| /api/foods/searchBrandItem |  GET           | Returns list of foods including brand items based on search (query) keywords |
| /api/foods/searchMultiple |    GET   | Returns data for multiple food items (comma separated). (required queries: fdcIds) (optional queries: format, pageSize, pageNumber, nutrientNums)      |
| /api/foods/searchPortionSizes/{fdcId}| GET  | Returns list of portion sizes for item                  | 
| /api/foods/meals/addToNewMeal/{fdcid}| POST  | Creates and returns new meal object containing food item (optional query parameter to specify grams: default 100) |
| /api/foods/meals/addToMeal/{mealId}/{fdcId} | POST | Updates and returns specified meal with updated nutritional info from food (optional grams query) |
| /api/foods/deleteFoodFromMeal/{mealId}/{foodId} | DELETE | Removes food object from meal, updates nutrient values and returns updated meal (NOTE: foodid is different from fdcid and is found in meal data listed after specific food's foodNutrients array as "_id")|
| /api/foods/deleteMeal/{mealId} | DELETE     | Removes meal from database      |
| /api/foods/meal/{mealId}     |   PATCH      | Update or add description for meal      |
| /api/foods/createCustomFood  |   POST       | Creates new food item based on given data |
| /api/foods/customFoodList    |   GET        | Returns list of created custom foods      |
| /api/foods/addCustomFoodToMeal/{mealId}/{foodId}|  POST  | Adds custom food item and nutrient values to meal |
| /api/foods/deleteCustomFood/{foodId}  |   DELETE       | Deletes food item from database  |
| /api/foods/dailyValues       | GET          | Returns list of recommended daily values for nutrients according to FDA guidelines |
| /api/foods/meals/compareToDV/{mealId} | GET | Returns list comparing nutrient values from meal to dailyValues |
