import React, { useState } from "react";
import classes from "../../styles/recipeIdeas.module.scss";
import { FaClock, FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleRecipeViewClick = () => {
    let recipeName = recipe["name"].toLowerCase();

    localStorage.setItem("selectedRecipe", JSON.stringify(recipe));

    navigate(`/recipes/${recipeName}`);
  };
  return (
    <div
      className={classes.recipeCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className={classes.recipeImageWrapper}>
        <img
          src={recipe["imageUrl"] || "https://dummyimage.com/600x400/000/fff"}
          className={classes.recipeImage}
          alt="Recipe"
        />
      </div>

      {/* Title + Button */}
      <div className={classes.recipeHeader}>
        <h3 className={classes.recipeName}>
          {isHovered
            ? recipe["name"]
            : recipe["name"].length > 20
            ? recipe["name"].slice(0, 20) + "..."
            : recipe["name"]}
        </h3>
        <button
          className={classes.recipeButton}
          onClick={handleRecipeViewClick}
        >
          View
        </button>
      </div>

      {/* Extra Details */}
      <div className={classes.extraDetails}>
        <div className={classes.detailItem}>
          <FaUtensils className={classes.icon} /> Perfect for{" "}
          <span>{recipe["category"]}</span>
        </div>
        <div className={classes.detailItem}>
          <FaClock className={classes.icon} /> Ready in{" "}
          <span>{recipe["cookTime"]}</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
