function normalizeString(string) {
  const diacriticRegex = new RegExp(/\p{Diacritic}/, "gu");
  const spaceRegex = new RegExp(/\s/, "g");
  return string
    .normalize("NFD") // returns the string in normalized Unicode form with decomposition of diacritics (accents, umlauts, cedillas, etc.)
    .replace(diacriticRegex, "") // remove diacritics
    .toLowerCase()
    .replace(spaceRegex, ""); // remove all spaces
}

function getTagValues(tags) {
  let res = [];
  for (let i = 0; i < tags.length; i++) {
    res.push(normalizeString(tags[i].innerText));
  }
  return res;
}

function getTagListToSearchIn(recipe) {
  let res = [];
  for (let i = 0; i < recipe.ingredients.length; i++) res.push(normalizeString(recipe.ingredients[i].ingredient));
  res.push(normalizeString(recipe.appliance));
  for (let j = 0; j < recipe.ustensils.length; j++) res.push(normalizeString(recipe.ustensils[j]));
  return res;
}

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

function mainInputSearch(recipes, inputValue) {
  const res = [];
  const keyword = normalizeString(inputValue);
  for (let i = 0; i < recipes.length; i++) {
    let goToNextIteration = false;
    if (normalizeString(recipes[i].name).includes(keyword)) {
      res.push(recipes[i]);
      goToNextIteration = true;
    } else if (!goToNextIteration && normalizeString(recipes[i].description).includes(keyword)) {
      res.push(recipes[i]);
      goToNextIteration = true;
    } else if (!goToNextIteration) {
      const ingredientsArray = [];
      for (let j = 0; j < recipes[i].ingredients.length; j++) {
        if (normalizeString(recipes[i].ingredients[j].ingredient).includes(keyword)) res.push(recipes[i]);
      }
    }
  }
  return res;
}

function getFilteredTags(recipes) {
  const res = {};
  res.ingredients = tagsFactory(recipes, "ingredients");
  res.appliances = tagsFactory(recipes, "appliances");
  res.ustensils = tagsFactory(recipes, "ustensils");
  return res;
}

function getSearchResult(recipes, inputValue, pinnedTags) {
  const res = {};
  let recipesListToSearchIn = recipes;
  if (pinnedTags.length > 0) recipesListToSearchIn = filterRecipesByTags(recipes, pinnedTags);
  if (inputValue.length < 3) res.filteredRecipes = recipesListToSearchIn; 
  else if (inputValue.length >= 3) res.filteredRecipes = mainInputSearch(recipesListToSearchIn, inputValue); 
  res.filteredTags = getFilteredTags(res.filteredRecipes);
  return res;
}

