import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchSearchedRecipe = createAsyncThunk(
  "recipes/fetchSearchedRecipe",
  async (searchQuery) => {
    const response = await fetch(
      `http://localhost:8080/api/search?query=${searchQuery}`
    ); // Replace with actual API
    const data = await response.json();
    console.log("searched response : ", data);
    return data;
  }
);

const initialState = {
  recipes: [],
  searchQuery: "",
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const recipeSlice = createSlice({
  name: "recipes",
  initialState,

  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchedRecipe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSearchedRecipe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.recipes = action.payload;
      })
      .addCase(fetchSearchedRecipe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery } = recipeSlice.actions;

export default recipeSlice.reducer;
