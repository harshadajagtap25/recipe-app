import React, { useEffect, useState } from "react";
import classes from "../styles/recipeIdeas.module.scss";
import { useDispatch, useSelector } from "react-redux";
import Header from "@/components/homePage/Header";
import RecipeIdeasList from "@/components/RecipeIdeasPage/RecipeIdeasList";
import { fetchTopRecipes } from "@/redux/recipeSlice";
import { GiMeal } from "react-icons/gi";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/common/Loader";

const RecipeIdeas = () => {
  const { top3Status, top3Error, top3RecipeSuggestions } = useSelector(
    (state) => state.recipes
  );

  const dispatch = useDispatch();
  const { currentUser } = useAuth();

  // Function to fetch top 3 recipes
  const getTop3Recipes = async () => {
    await dispatch(fetchTopRecipes(currentUser.id)).unwrap();
  };

  useEffect(() => {
    getTop3Recipes();
  }, []);

  return (
    <div className={classes.mainContainer}>
      <Header />
      <div className={classes.recipeIdeaWrapper}>
        {top3RecipeSuggestions && top3RecipeSuggestions["isSuggested"] ? (
          <h2 className={classes.pageTitle}>
            <GiMeal color="#2e7d32" /> Best 3 Recipes from Your Fridge
          </h2>
        ) : (
          <h2 className={classes.pageTitle}>
            <GiMeal color="#2e7d32" /> Recipe Ideas for You
          </h2>
        )}

        {top3RecipeSuggestions && top3RecipeSuggestions["isSuggested"] ? (
          <div className={classes.description}>
            The best meal ideas based on your available ingredients.
          </div>
        ) : (
          <div className={classes.description}>
            Hard to find recipes from your current inventory. Here are some
            ideas that might inspire you!
          </div>
        )}
      </div>
      {top3Status === "loading" && <Loader />}
      {top3Status === "failed" && <p style={{ color: "red" }}>{top3Error}</p>}
      {top3Status === "succeeded" && <RecipeIdeasList />}
    </div>
  );
};

export default RecipeIdeas;
