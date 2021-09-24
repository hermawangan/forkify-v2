import * as model from './model.js';
import recipeView from './views/recipeViews.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarkView.js';
import paginationView from './views/PaginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable'; // polyfill eveything
import 'regenerator-runtime/runtime'; //polyfiling async awaite
import { async } from 'regenerator-runtime';
import paginationView from './views/paginationView.js';

if (module.hot) {
  module.hot.accept();
}
// // https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// ! API call
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // todo update results view to mark selected search result
    resultsView.update(model.getSearchResultPage());

    // todo loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // todo rendering recipe
    recipeView.render(model.state.recipe);

    // todo updating bookmark view
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2) Load search reesults
    await model.loadSearchResult(query);

    //3 Render results
    // resultsView.render(model.state.search.result);
    resultsView.render(model.getSearchResultPage());

    // 4) Render initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlServings = function (newServings) {
  // todo update the recipe servings(in state)
  model.updateServings(newServings);

  // todo update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlPagination = function (goToPage) {
  //1 Render NEW results
  resultsView.render(model.getSearchResultPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlAddBookmark = function () {
  // 1) Add remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2) Update recipe view
  recipeView.update(model.state.recipe);

  //3) render bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // SHow loading spinner
    addRecipeView.renderSpinner();
    //uploads the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //render recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('Welcome to the application');
};

const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.addHandlerRender(controlBookmarks);
  addRecipeView.addHandlerUploads(controlAddRecipe);
  newFeature();
};
init();
