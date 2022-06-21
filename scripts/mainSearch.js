function normalizeString(string) {
  return string
    .normalize("NFD") // returns the string in normalized Unicode form with decomposition of diacritics (accents, umlauts, cedillas, etc.)
    .replace(/\p{Diacritic}/gu, "") // remove diacritics
    .toLowerCase()
    .replace(/\s/g, ""); // remove all spaces
}

function getTagValues(tags) {
  return [...tags].map((tag) => normalizeString(tag.innerText));
}

function getTagListToSearchIn(recipe) {
  return recipe.ingredients
    .map((ingredient) => ingredient.ingredient)
    .concat(recipe.appliance)
    .concat(recipe.ustensils)
    .map((el) => normalizeString(el));
}

function filterRecipesByTags(recipes, tags) {
  return recipes.filter((recipe) => getTagValues(tags).every((val) => getTagListToSearchIn(recipe).indexOf(val) > -1));
}

function mainInputSearch(recipes, inputValue) {
  const keyword = normalizeString(inputValue);
  return recipes.filter((recipe) => 
    normalizeString(recipe.name).includes(keyword)
      ? true
      : normalizeString(recipe.description).includes(keyword)
      ? true
      : recipe.ingredients.map((ingredient) => normalizeString(ingredient.ingredient)).includes(keyword)
      ? true
      : false
  );
}

function getFilteredTags(recipes) {
  const res = {};
  res.ingredients = tagsFactory(recipes, "ingredients");
  res.appliances = tagsFactory(recipes, "appliances");
  res.ustensils = tagsFactory(recipes, "ustensils");
  return res;
}

function getSearchResult(recipes, inputValue, pinnedTags) {
  console.log(pinnedTags)
  const res = {};
  let recipesListToSearchIn = recipes;
  if (pinnedTags.length > 0) recipesListToSearchIn = filterRecipesByTags(recipes, pinnedTags);
  if (inputValue.length < 3) res.filteredRecipes = recipesListToSearchIn;
  else if (inputValue.length >= 3) res.filteredRecipes = mainInputSearch(recipesListToSearchIn, inputValue);
  res.filteredTags = getFilteredTags(res.filteredRecipes);
  return res;
}