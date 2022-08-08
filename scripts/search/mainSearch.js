/* eslint-disable no-undef */
/**
 * OPTION 2: Functionnal programming
 * This file manages the filtering of recipes based on user input and tags
 */

/**
 *
 * @param {NodeList} tags
 * @returns {Array.<string>} array of tag names
 */
function getTagValues(tags) {
  return [...tags].map((tag) => normalizeString(tag.innerText));
}

/**
 *
 * @param {Object} recipe
 * @returns {Array.<string>} single array with ingredient, appliance and ustensil tag names
 */
function getTagListToSearchIn(recipe) {
  return recipe.ingredients
    .map((ingredient) => ingredient.ingredient)
    .concat(recipe.appliance)
    .concat(recipe.ustensils)
    .map((el) => normalizeString(el));
}

/**
 *
 * @param {Object} recipes
 * @param {NodeList} tags
 * @returns {Array.<Object>}
 */
function filterRecipesByTags(recipes, tags) {
  return recipes.filter((recipe) => getTagValues(tags).every((val) => getTagListToSearchIn(recipe).indexOf(val) > -1));
}

/**
 *
 * @param {Array} ingredients
 * @param {String} keyword
 * @returns {Boolean}
 */
function isIngredientMatching(ingredients, keyword) {
  let ingredientsArr = ingredients.map((ingredient) => ingredient.ingredient);
  return ingredientsArr.some((ingredient) => normalizeString(ingredient).includes(keyword));
}

/**
 *
 * @param {Object} recipe
 * @param {String} keyword
 * @returns {Boolean}
 */
function isRecipeMatching(recipe, keyword) {
  return normalizeString(recipe.name).includes(keyword)
    ? true
    : normalizeString(recipe.description).includes(keyword)
      ? true
      : isIngredientMatching(recipe.ingredients, keyword)
        ? true
        : false;
}

/**
 *
 * @param {Object} recipes
 * @param {String} inputValue
 * @returns {Array.<Object>} : filtered recipes
 */
function mainInputSearch(recipes, inputValue) {
  const keyword = normalizeString(inputValue);
  return recipes.filter((recipe) => isRecipeMatching(recipe, keyword));
}

/**
 *
 * @param {Object} recipes
 * @returns {Object} filtered tags
 */
function getFilteredTags(recipes) {
  const res = {};
  res.ingredients = tagsFactory(recipes, "ingredients");
  res.appliances = tagsFactory(recipes, "appliances");
  res.ustensils = tagsFactory(recipes, "ustensils");
  return res;
}

/**
 *
 * @param {Object} recipes
 * @param {String} inputValue
 * @param {NodeList} pinnedTags
 * @returns {Object} filtered recipes and tags
 */
// eslint-disable-next-line no-unused-vars
function getSearchResult(recipes, inputValue, pinnedTags) {
  const res = {};
  let recipesListToSearchIn = recipes;
  if (pinnedTags.length > 0) recipesListToSearchIn = filterRecipesByTags(recipes, pinnedTags);
  if (inputValue.length < 3) res.filteredRecipes = recipesListToSearchIn;
  else if (inputValue.length >= 3) res.filteredRecipes = mainInputSearch(recipesListToSearchIn, inputValue);
  res.filteredTags = getFilteredTags(res.filteredRecipes);
  return res;
}
