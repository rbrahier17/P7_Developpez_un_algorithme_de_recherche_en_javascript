function normalizeString(string) {
  return string
    .normalize("NFD") // returns the string in normalized Unicode form with decomposition of diacritics (accents, umlauts, cedillas, etc.)
    .replace(/\p{Diacritic}/gu, "") // remove diacritics
    .toLowerCase()
    .replace(/\s/g, ""); // remove all spaces
}

function getTagValues(tags) {
  let res = [];
  for (let tag of tags) {
    res.push(normalizeString(tag.innerText));
  }
  return res;
}

function getTagListToSearchIn(recipe) {
  let res = [];
  for (const ingredient of recipe.ingredients) {
    res.push(normalizeString(ingredient.ingredient));
  }
  res.push(normalizeString(recipe.appliance));
  for (const ustensil of recipe.ustensils) {
    res.push(normalizeString(ustensil));
  }
  return res;
}

function filterRecipesByTags(recipes, tags) {
  let res = [];
  const tagValues = getTagValues(tags);
  for (const recipe of recipes) {
    let pushRecipe = true;
    const tagListToSearchIn = getTagListToSearchIn(recipe);
    for (const val of tagValues) {
      if (tagListToSearchIn.indexOf(val) === -1) pushRecipe = false;
    }
    if (pushRecipe) res.push(recipe);
  }
  return res;
}

function mainInputSearch(recipes, inputValue) {
  let res = [];
  const keyword = normalizeString(inputValue);
  for (const recipe of recipes) {
    let goToNextIteration = false;
    if (normalizeString(recipe.name).includes(keyword)) {
      res.push(recipe);
      goToNextIteration = true;
    } else if (!goToNextIteration && normalizeString(recipe.description).includes(keyword)) {
      res.push(recipe);
      goToNextIteration = true;
    } else if (!goToNextIteration) {
      for (const ingredient of recipe.ingredients) {
        if (normalizeString(ingredient.ingredient).includes(keyword)) {
          res.push(recipe);
        }
      }
    }
  }
  return res
}

function getFilteredTags(recipes) {
  const res = {}
  res.ingredients = tagsFactory(recipes, "ingredients");
  res.appliances = tagsFactory(recipes, "appliances");
  res.ustensils = tagsFactory(recipes, "ustensils");
  return res
}

function getSearchResult(recipes, inputValue, pinnedTags) {
  const res = {};
  let recipesListToSearchIn = recipes;
  if (pinnedTags.length > 0) recipesListToSearchIn = filterRecipesByTags(recipes, pinnedTags);
  if (inputValue.length < 3) res.filteredRecipes = recipesListToSearchIn;
  else if (inputValue.length >= 3) res.filteredRecipes = mainInputSearch(recipesListToSearchIn, inputValue)
  res.filteredTags = getFilteredTags(res.filteredRecipes)
  return res;
}
