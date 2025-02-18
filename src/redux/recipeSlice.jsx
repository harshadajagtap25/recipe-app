import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recipes: [
    { id: 1, name: "Pasta Alfredo" },
    { id: 2, name: "Chicken Curry" },
    { id: 3, name: "Veg Salad" },
    { id: 4, name: "Chocolate Cake" },
  ],
  searchQuery: "",
};

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setSearchQuery } = recipeSlice.actions;
export default recipeSlice.reducer;
