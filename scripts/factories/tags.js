/**
 *
 * @param { object } recipes
 * @param { string } tagType
 */
function tagsFactory(recipes, tagType) {
  if (!recipes || recipes.length < 1) return []
  
  let rawTags;

  switch (tagType) {
    case "ingredients":
      rawTags = recipes
        .map((recipe) => recipe.ingredients)
        .reduce((prev, current) => prev.concat(current))
        .map((ingredient) => ingredient.ingredient);
      break;
    case "appliances":
      rawTags = recipes.map((recipe) => recipe.appliance);
      break;
    case "ustensils":
      rawTags = recipes.map((recipe) => recipe.ustensils).reduce((prev, current) => prev.concat(current));
      break;
  }

  const uniqueTags = [...new Set(rawTags)];
  
  return uniqueTags
}
