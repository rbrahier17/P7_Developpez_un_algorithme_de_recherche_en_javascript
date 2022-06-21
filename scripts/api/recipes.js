// eslint-disable-next-line no-unused-vars
class RecipesApi {
  constructor () {
    this._url = "data/recipes.json";
  }

  async get () {
    return fetch(this._url)
      .then((res) => res.json())
      .catch((err) => console.log("an error occurs", err));
  }

  async getAllRecipes () {
    return (await this.get()).recipes;
  }

  async getOneRecipe (recipeId) {
    const recipes = (await this.get()).recipes;
    return recipes.filter((recipe) => recipe.id === parseInt(recipeId))[0];
  }
}
