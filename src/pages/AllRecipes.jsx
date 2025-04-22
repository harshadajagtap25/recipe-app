import { fetchAllRecipes } from "@/redux/recipeSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "../styles/allRecipes.module.scss";
import Header from "@/components/homePage/Header";

import AllRecipesComponent from "@/components/allRecipesComponents/AllRecipesComponent";

const AllRecipes = () => {
  const { allRecipesStatus, allRecipesError } = useSelector(
    (state) => state.recipes
  );

  const dispatch = useDispatch();

  const getAllRecipes = async () => {
    await dispatch(fetchAllRecipes()).unwrap();
  };

  useEffect(() => {
    getAllRecipes();
  }, []);

  return (
    <div className={classes.mainContainer}>
      <Header />
      {allRecipesStatus === "loading" && <p>Loading...</p>}
      {allRecipesStatus === "failed" && (
        <p style={{ color: "red" }}>{allRecipesError}</p>
      )}

      {allRecipesStatus === "succeeded" && <AllRecipesComponent />}
    </div>
  );
};

export default AllRecipes;
