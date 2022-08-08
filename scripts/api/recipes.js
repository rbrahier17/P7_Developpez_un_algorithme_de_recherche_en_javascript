// Allows to retrieve recipe datas

// eslint-disable-next-line no-unused-vars
class RecipesApi {
  constructor() {
    this._url = "data/recipes.json";
  }

  async get() {
    return fetch(this._url)
      .then((res) => res.json())
      .catch((err) => console.log("an error occurs", err));
  }

  /**
   *
   * @returns {Object} : the list of all recipes
   */
  async getAllRecipes() {
    return (await this.get()).recipes;
  }
}
