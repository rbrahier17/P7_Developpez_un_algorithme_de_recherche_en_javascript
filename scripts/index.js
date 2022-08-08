/* eslint-disable no-undef */

/**
 * 
 * @param {Object} recipes - A list of recipes
 */
function displayRecipes(recipes) {
  const recipesSection = document.querySelector(".recipes-cards-container");
  recipes.forEach((recipe) => {
    const recipeDOMcard = recipeCardFactory(recipe);
    recipesSection.appendChild(recipeDOMcard);
  });
}

/**
 * 
 * @param {Object} recipes - A list of recipes
 * @returns {Array.<Number>} - An array of recipes id's
 */
function getRecipesIds(recipes) {
  let res = [];
  for (const recipe of recipes) res.push(recipe.id);
  return res;
}

/**
 * 
 * @param {HTMLElement} DOMelement 
 */
function show(DOMelement) {
  DOMelement.style.display = "block";
}

/**
 * 
 * @param {HTMLElement} DOMelement 
 */
function hide(DOMelement) {
  DOMelement.style.display = "none";
}

function displayNoResults() {
  show(document.querySelector(".no-results"));
}

function hideNoResults() {
  hide(document.querySelector(".no-results"));
}

/**
 * 
 * @param {Object} filteredRecipes 
 */
function updateDOMRecipeDisplay(filteredRecipes) {
  if (filteredRecipes.length === 0) displayNoResults(); 
  else hideNoResults();
  const DOMrecipes = document.querySelectorAll(".recipe-card");
  const filteredRecipesIds = getRecipesIds(filteredRecipes);
  for (const DOMrecipe of DOMrecipes) {
    const DOMrecipeId = DOMrecipe.dataset.id;
    const hidingCondition = filteredRecipesIds.indexOf(parseInt(DOMrecipeId)) === -1;
    hidingCondition ? hide(DOMrecipe) : show(DOMrecipe);
  }
}

/**
 * 
 * @param {Object} filteredTags 
 */
function updateDOMTagMenus(filteredTags) {
  const DOMtagsIngredients = document.querySelectorAll(".ingredients .tag");
  const DOMtagsAppliances = document.querySelectorAll(".appliances .tag");
  const DOMtagsUstensils = document.querySelectorAll(".ustensils .tag");
  for (const DOMtagIngredient of DOMtagsIngredients) {
    const hidingCondition = filteredTags.ingredients.indexOf(DOMtagIngredient.innerText) === -1;
    hidingCondition ? hide(DOMtagIngredient) : show(DOMtagIngredient);
  }
  for (const DOMtagAppliance of DOMtagsAppliances) {
    const hidingCondition = filteredTags.appliances.indexOf(DOMtagAppliance.innerText) === -1;
    hidingCondition ? hide(DOMtagAppliance) : show(DOMtagAppliance);
  }
  for (const DOMtagUstensil of DOMtagsUstensils) {
    const hidingCondition = filteredTags.ustensils.indexOf(DOMtagUstensil.innerText) === -1;
    hidingCondition ? hide(DOMtagUstensil) : show(DOMtagUstensil);
  }
}

/**
 * 
 * @param {Object} recipes - A list of recipes
 */
function initSearchRecipes(recipes) {
  const pinnedTags = document.querySelectorAll(".pinnedTag");
  const mainInputValue = document.querySelector(".main-search-container input").value;
  const searchResult = getSearchResult(recipes, mainInputValue, pinnedTags);
  updateDOMRecipeDisplay(searchResult.filteredRecipes);
  updateDOMTagMenus(searchResult.filteredTags);
  addTagsListener(recipes);
}

/**
 * 
 * @param {Object} recipes - A list of recipes
 */
function listenTagRemoval(recipes) {
  const deleteTagBtns = document.querySelectorAll(".delete-tag-btn");
  deleteTagBtns.forEach((btn) => btn.addEventListener("click", () => initSearchRecipes(recipes))); // Refreshes the search when a tag is deleted
}

/**
 * 
 * @param {Object} recipes - A list of recipes
 */
function addTagsListener(recipes) {
  const tags = document.querySelectorAll(".tag");
  tags.forEach((tag) =>
    tag.addEventListener("click", (e) => {
      pinTag(e), initSearchRecipes(recipes), listenTagRemoval(recipes);
    })
  );
}


async function init() {
  const recipesApi = new RecipesApi();
  const recipes = await recipesApi.getAllRecipes();

  const mainInput = document.querySelector(".main-search-container input");


  displayRecipes(recipes);
  mainInput.addEventListener("input", () => initSearchRecipes(recipes));
  addTagsListener(recipes);
}

init();
