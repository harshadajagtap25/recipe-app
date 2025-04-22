import React from "react";
import classes from "../../styles/recipeIdeas.module.scss";
import { useSelector } from "react-redux";
import RecipeCard from "../RecipeIdeasPage/RecipeCard";
import { MdOutlineRestaurantMenu } from "react-icons/md";

const AllRecipesComponent = () => {
  const { allRecipes } = useSelector((state) => state.recipes);

  return (
    <div className={classes.recipeIdeaWrapper}>
      <h2 className={classes.pageTitle}>
        <MdOutlineRestaurantMenu color="#2e7d32" /> {"  "}
        Find Your Next Meal
      </h2>

      <div className={classes.description}>
        Browse a variety of recipes and find the perfect dish for any occasion.
      </div>

      <div className={classes.recipeListWrapper}>
        {allRecipes["recipes"] &&
          allRecipes["recipes"].map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} />
          ))}
      </div>
    </div>
  );
};

export default AllRecipesComponent;
