import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchIngredientsToSelect = createAsyncThunk(
  "fridge/fetchIngredientsToSelect",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/ingredient/getList`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch ingredients to select"
      );
    }
  }
);

export const fetchIngredientsForDisplay = createAsyncThunk(
  "fridge/fetchIngredientsForDisplay",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/fridge/${userId}/inventory`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch ingredients"
      );
    }
  }
);

export const addIngredient = createAsyncThunk(
  "fridge/addIngredient",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/fridge/${payload.userId}/add`,
        payload.ingredientToAdd,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add ingredient"
      );
    }
  }
);

export const deleteIngredient = createAsyncThunk(
  "fridge/deleteIngredient",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/fridge/${payload.userId}/remove`,
        payload.payload,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete ingredient"
      );
    }
  }
);

const initialState = {
  ingredientNames: [],
  fetchIngredientNamesStatus: "idle",
  fetchIngredientNamesError: null,

  ingredients: [],
  fetchStatus: "idle",
  fetchError: null,

  addStatus: "idle",
  addError: null,
  deleteStatus: "idle",
  deleteError: null,
};

const fridgeSlice = createSlice({
  name: "fridge",
  initialState,

  reducers: {
    resetFetchError: (state) => {
      state.fetchError = null;
      state.fetchStatus = "idle";
    },
    resetAddError: (state) => {
      state.addError = null;
      state.addStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchIngredients
      .addCase(fetchIngredientsForDisplay.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchIngredientsForDisplay.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredientsForDisplay.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.payload;
      })

      // Handle addIngredient
      .addCase(addIngredient.pending, (state) => {
        state.addStatus = "loading";
      })
      .addCase(addIngredient.fulfilled, (state, action) => {
        state.addStatus = "succeeded";
        state.ingredients["items"].push(action.payload["results"][0]);
      })
      .addCase(addIngredient.rejected, (state, action) => {
        state.addStatus = "failed";
        state.addError = action.payload;
      })

      // Handle delete Ingredient
      .addCase(deleteIngredient.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteIngredient.fulfilled, (state) => {
        state.deleteStatus = "succeeded";
      })
      .addCase(deleteIngredient.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.addError = action.payload;
      })

      // Handle fetchIngredientsToSelect
      .addCase(fetchIngredientsToSelect.pending, (state) => {
        state.fetchIngredientNamesStatus = "loading";
      })
      .addCase(fetchIngredientsToSelect.fulfilled, (state, action) => {
        state.fetchIngredientNamesStatus = "succeeded";
        state.ingredientNames = action.payload;
      })
      .addCase(fetchIngredientsToSelect.rejected, (state, action) => {
        state.fetchIngredientNamesStatus = "failed";
        state.fetchIngredientNamesError = action.payload;
      });
  },
});

export const { resetFetchError, resetAddError } = fridgeSlice.actions;

export default fridgeSlice.reducer;
