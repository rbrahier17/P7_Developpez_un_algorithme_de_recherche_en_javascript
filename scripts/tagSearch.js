function toggleMenu(e) {
  const targetMenu = e.target.parentNode.parentNode; // The menu related to the clicked input
  const expandedMenu = document.querySelector(".tag-search-menu.expanded");
  toggleInputPlaceholder(targetMenu, expandedMenu);
  if (expandedMenu) {
    expandedMenu.classList.remove("expanded");
    expandedMenu.querySelector("input").blur();
    if (expandedMenu === targetMenu) return;
  }
  targetMenu.classList.add("expanded");
}

function toggleInputPlaceholder(targetMenu, expandedMenu) {
  const targetInput = targetMenu.querySelector("input");
  if (expandedMenu) {
    const expandedInput = expandedMenu.querySelector("input");
    switch (expandedInput.id) {
      case "ingredients":
        expandedInput.placeholder = "Ingrédients";
        break;
      case "appliances":
        expandedInput.placeholder = "Appareils";
        break;
      case "ustensils":
        expandedInput.placeholder = "Ustensiles";
    }
    if (expandedMenu === targetMenu) return;
  }
  switch (targetInput.id) {
    case "ingredients":
      targetInput.placeholder = "Rechercher un ingrédient";
      break;
    case "appliances":
      targetInput.placeholder = "Rechercher un appareil";
      break;
    case "ustensils":
      targetInput.placeholder = "Rechercher un ustensile";
  }
}


function buildTagList(recipes, category) {
  const DOMlist = document.querySelector(`.${category} .dropdown-list`);
  DOMlist.innerHTML = ''
  if (!recipes || recipes.length < 1) {console.log ("no RECIPES"); return}
  const tags = tagsFactory(recipes, `${category}`);
  tags.forEach((tag) => {
    const DOMtag = document.createElement('li')
    DOMtag.setAttribute("class", "tag")
    DOMtag.setAttribute("data-category", `${category}`)
    DOMtag.innerText = tag
    DOMlist.appendChild(DOMtag)
    DOMtag.addEventListener("click", (e) => pinTag(e))
  })
}

function buildAllTagLists(recipes) {
  const listCategories = ["ingredients", "appliances", "ustensils"];
  listCategories.forEach((category) => buildTagList(recipes, category))
}

async function filterList(e) {
  const recipesApi = new RecipesApi();
  const recipes = await recipesApi.getAllRecipes();
  const tags = tagsFactory(recipes, e.target.id);
  const targetList = e.target.parentNode.nextElementSibling; // The menu related to the input
  const userInput = e.target.value;

  targetList.innerHTML = "";
  const filteredList = tags.filter((tag) => tag.toLowerCase().indexOf(userInput.toLowerCase()) !== -1);
  filteredList.forEach((tag) => (targetList.innerHTML += `<li class="tag" data-category="${e.target.id}">${tag}</li>`));
  const allTags = document.querySelectorAll(".tag");
  allTags.forEach((tag) => tag.addEventListener("click", pinTag));
}

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function pinTag(e) {
  const pinnedTagsContainer = document.querySelector(".pinned-tags-container");
  const xpath = `//div[@class="pinned-tags-container"]//li/span[text()="${e.target.textContent}"]`
  const tagAlreadyPinned = getElementByXpath(xpath) ? getElementByXpath(xpath).parentNode : null
  if (tagAlreadyPinned) return;
  else {
    const DOMPinnedTag = `<li class="pinnedTag ${e.target.dataset.category}">
                            <span>${e.target.textContent}</span>
                            <button class="delete-tag-btn" onclick="this.parentNode.remove()"> 
                              <img src="assets/delete.png"/>
                            </button>
                          </li>`;
    pinnedTagsContainer.innerHTML += DOMPinnedTag;
  }
}

async function init() {
  const recipesApi = new RecipesApi();
  const recipes = await recipesApi.getAllRecipes();
  const inputs = document.querySelectorAll(".tag-search-menu input");
  buildAllTagLists(recipes);
  inputs.forEach((input) => input.addEventListener("click", toggleMenu));
  inputs.forEach((input) => input.addEventListener("input", filterList));
}

init();
