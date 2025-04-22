import Header from "@/components/homePage/Header";
import React from "react";
import classes from "../styles/recipes.module.scss";
import RecipeDetails from "@/components/recipeDetails/RecipeDetails";
import { useParams } from "react-router-dom";

const Recipies = () => {
  const { recipeName } = useParams();

  return (
    <div className={classes.mainContainer}>
      <Header />
      <RecipeDetails recipeName={recipeName} />
    </div>
  );
};

export default Recipies;
