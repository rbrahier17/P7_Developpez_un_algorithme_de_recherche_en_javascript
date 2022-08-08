/* eslint-disable no-undef */
/**
 *
 * OPTION 1: Classic Loops
 * This file manages the filtering of recipes based on user input and tags
 */

/**
 *
 * @param {NodeList} tags
 * @returns {Array.<string>} res
 */
function getTagValues(tags) {
  let res = [];
  for (let i = 0; i < tags.length; i++) {
    res.push(normalizeString(tags[i].innerText));
  }
  return res;
}

/**
 *
 * @param {Object} recipe
 * @returns {Array.<string>} res : single array with ingredient, appliance and ustensil tag names
 */
function getTagListToSearchIn(recipe) {
  let res = [];
  for (let i = 0; i < recipe.ingredients.length; i++) res.push(normalizeString(recipe.ingredients[i].ingredient));
  res.push(normalizeString(recipe.appliance));
  for (let j = 0; j < recipe.ustensils.length; j++) res.push(normalizeString(recipe.ustensils[j]));
  return res;
}

/**
 *
 * @param {Object} recipes
 * @param {NodeList} tags
 * @returns {Array.<Object>} res
 */
function filterRecipesByTags(recipes, tags) {
  let res = [];
  const tagValues = getTagValues(tags);
  for (let i = 0; i < recipes.length; i++) {
    let pushRecipe = true;
    const tagListToSearchIn = getTagListToSearchIn(recipes[i]);
    for (let j = 0; j < tagValues.length; j++) {
      if (tagListToSearchIn.indexOf(tagValues[j]) === -1) pushRecipe = false;
    }
    if (pushRecipe) res.push(recipes[i]);
  }
  return res;
}

/**
 *
 * @param {Array} ingredients
 * @param {String} keyword
 * @returns {Boolean}
 */
function isIngredientMatching(ingredients, keyword) {
  for (let i = 0; i < ingredients.length; i++) {
    if (normalizeString(ingredients[i].ingredient).includes(keyword)) return true;
  }
  return false;
}

/**
 *
 * @param {Object} recipe
 * @param {String} keyword
 * @returns {Boolean}
 */
function isRecipeMatching(recipe, keyword) {
  if (recipe.name.includes(keyword)) return true;
  if (recipe.description.includes(keyword)) return true;
  if (isIngredientMatching(recipe.ingredients, keyword)) return true;
  return false;
}

/**
 *
 * @param {Object} recipes
 * @param {String} inputValue
 * @returns {Array.<Object>} res : filtered recipes
 */
function mainInputSearch(recipes, inputValue) {
  const res = [];
  const keyword = normalizeString(inputValue);
  for (let i = 0; i < recipes.length; i++) {
    if (isRecipeMatching(recipes[i], keyword)) res.push(recipes[i]);
  }
  return res;
}

/**
 *
 * @param {Object} recipes
 * @returns {Object} res : filtered tags
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
 * @returns {Object} res : filtered recipes and tags
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
