/* eslint-disable react/prop-types */

import React from "react";
import classes from "../../styles/recipeIdeas.module.scss";
import RecipeCard from "./RecipeCard";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RecipeIdeasList = () => {
  const { top3RecipeSuggestions } = useSelector((state) => state.recipes);
  const navigate = useNavigate();

  const handleSeeMoreClick = () => {
    navigate(`/allRecipes`);
  };

  return (
    <div className={classes.recipeIdeaWrapper}>
      <div className={classes.recipeListWrapper}>
        {top3RecipeSuggestions &&
        top3RecipeSuggestions["recipes"] &&
        top3RecipeSuggestions["recipes"].length > 0 ? (
          top3RecipeSuggestions["recipes"].map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} />
          ))
        ) : (
          <p>No suggested recipes available</p>
        )}
      </div>

      <div className={classes.seeMoreWrapper}>
        <button className={classes.seeMoreButton} onClick={handleSeeMoreClick}>
          See More Recipes
        </button>
      </div>
    </div>
  );
};

export default RecipeIdeasList;
