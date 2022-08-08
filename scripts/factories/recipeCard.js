/* eslint-disable indent */
/* eslint-disable no-unused-vars */

/**
 *
 * @param {Object} recipe
 * @returns {HTMLElement} DOM element for the recipe
 */
function recipeCardFactory(recipe) {
  const card = document.createElement("article");
  card.setAttribute("class", "recipe-card");
  card.setAttribute("data-id", recipe.id);

  /**
   * @param { Number } qty : ingredient quantity
   * @param { string } unit : ingredient quantity unit (ml, grammes, Kg...)
   * @returns { string } formated quantity and unit
   */
  function formatIngredientQty(qty, unit) {
    if (!qty) return "";
    if (!unit) return ": " + qty;

    switch (true) {
      case unit.toLowerCase().indexOf("cuillère") >= 0:
        return qty > 1 ? ": " + qty + " cuillères" : ": " + qty + " cuillère";
      case unit.toLowerCase().indexOf("gramme") >= 0:
        return ": " + qty + "g";
      case unit.toLowerCase().indexOf("litre") >= 0:
        return ": " + qty + "L";
      case unit.toLowerCase().indexOf("sachet") >= 0:
        return qty > 1 ? ": " + qty + " sachets" : ": " + qty + " sachet";
      default:
        return unit.length > 2 ? ": " + ` ${qty} ${unit}` : ": " + ` ${qty}${unit}`;
    }
  }

  /**
   * Returns recipe ingredients as list items, ready to be injected in HTML
   * @returns { String }
   */
  function ingredientsToListItems() {
    let res = "";
    recipe.ingredients.forEach((ingredient) => {
      const name = ingredient.ingredient;
      const qtyAndUnit = formatIngredientQty(ingredient.quantity, ingredient.unit);
      res += `<li>${name}<span>${qtyAndUnit}</span></li>`;
    });
    return res;
  }

  const cardHTMLContent = ` <div class="img-placeholder"></div>
                            <div class="card-content">
                              <header>
                                <h3>${recipe.name}</h3>
                                <div class="prepa-time">
                                  <img src="assets/clock.png" aria-hidden="true" />
                                  ${recipe.time + " min"}
                                </div>
                              </header>
                              <div class="card-details">
                                <ul>
                                ${ingredientsToListItems()}
                                </ul>
                                <p>${recipe.description}</p>
                              </div>
                            </div>
                          `;

  card.innerHTML = cardHTMLContent;

  return card;
}
