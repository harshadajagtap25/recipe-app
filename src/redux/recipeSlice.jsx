import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = "https://backend-fridgerecipe.onrender.com";

export const fetchTopRecipes = createAsyncThunk(
  "fridge/fetchTopRecipes",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/recipe/suggestion/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch top 3 recipe"
      );
    }
  }
);

export const fetchAllRecipes = createAsyncThunk(
  "fridge/fetchAllRecipes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recipe/all`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch all recipe"
      );
    }
  }
);

const initialState = {
  top3RecipeSuggestions: [],
  top3Status: "idle",
  top3Error: null,
  allRecipes: [],
  allRecipesStatus: "idle",
  allRecipesError: null,
};

const recipeSlice = createSlice({
  name: "recipes",
  initialState,

  reducers: {
    resetTop3States: (state) => {
      state.top3Error = null;
      state.top3Status = "idle";
    },
  },

  extraReducers: (builder) => {
    // Top 3 recipes
    builder
      .addCase(fetchTopRecipes.pending, (state) => {
        state.top3Status = "loading";
      })
      .addCase(fetchTopRecipes.fulfilled, (state, action) => {
        state.top3Status = "succeeded";
        state.top3RecipeSuggestions = action.payload;
      })
      .addCase(fetchTopRecipes.rejected, (state, action) => {
        state.top3Status = "failed";
        state.top3Error = action.payload;
      });

    // All recipes
    builder
      .addCase(fetchAllRecipes.pending, (state) => {
        state.allRecipesStatus = "loading";
      })
      .addCase(fetchAllRecipes.fulfilled, (state, action) => {
        state.allRecipesStatus = "succeeded";
        state.allRecipes = action.payload;
      })
      .addCase(fetchAllRecipes.rejected, (state, action) => {
        state.allRecipesStatus = "failed";
        state.allRecipesError = action.payload;
      });
  },
});

export const { resetTop3States } = recipeSlice.actions;

export default recipeSlice.reducer;
