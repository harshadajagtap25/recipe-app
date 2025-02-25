import { configureStore } from "@reduxjs/toolkit";
import recipeReducer from "./recipeSlice";
import fridgeReducer from "./fridgeSlice";

const store = configureStore({
  reducer: {
    recipes: recipeReducer,
    fridge: fridgeReducer,
  },
});

export default store;
