import React, { useEffect, useState } from "react";
import classes from "../../styles/recipes.module.scss";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { FaLeaf, FaTags } from "react-icons/fa";
import { GiCookingPot, GiForkKnifeSpoon, GiSandsOfTime } from "react-icons/gi";
import { MdOutlineTimer } from "react-icons/md";
import { useParams } from "react-router-dom";

const RecipeDetails = () => {
  const { recipeName } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const storedRecipe = localStorage.getItem("selectedRecipe");
    if (storedRecipe) {
      const parsed = JSON.parse(storedRecipe);

      if (parsed.name.toLowerCase() === recipeName) {
        setRecipe(parsed);
      } else {
        setRecipe(null);
      }
    }
  }, [recipeName]);

  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div className={classes.recipeWrapper}>
      <h1 className={classes.recipeNameCaptial}>{recipe["name"]}</h1>
      <div className={classes.tagsContainer}>
        {recipe["tags"].map((tag, index) => {
          return (
            <div className={classes.tag} key={index}>
              {tag}
            </div>
          );
        })}
      </div>
      <div className={classes.recipeDetailsCard}>
        <div className={classes.firstContainer}>
          <div className={classes.imageWrapper}>
            <img
              src={recipe["imageUrl"]}
              alt={recipeName}
              className={classes.recipeImage}
            />
          </div>

          <div className={classes.extraWrapper}>
            <h6 className={classes.extraDetailsHeader}>
              <span className={classes.extraText}>
                <FaTags color="#FF9800" /> {"  "} Category:
              </span>{" "}
              {recipe["category"]}
            </h6>
            <h6>
              <span className={classes.extraText}>
                {" "}
                <GiSandsOfTime color="#FF9800" /> {"  "}Prep Time:
              </span>{" "}
              {recipe["prepTime"]} min
            </h6>
            <h6>
              <span className={classes.extraText}>
                {" "}
                <MdOutlineTimer color="#FF9800" /> {"  "}Cook Time:
              </span>{" "}
              {recipe["cookTime"]} min
            </h6>
            <h6>
              <span className={classes.extraText}>
                {" "}
                <GiForkKnifeSpoon color="#FF9800" /> {"  "}Servings:
              </span>{" "}
              {recipe["servings"]}
            </h6>
          </div>

          <div className={classes.ingredientWrapper}>
            <h6>
              <FaLeaf color="#4CAF50" />
              {"  "} Ingredients needed
            </h6>
            <div className={classes.ingredientAvaliabilty}>
              <div>
                <FaCircleCheck
                  className={`${classes.checkMark} ${classes.demoCheckMark}`}
                />{" "}
                Available Ingredients
              </div>
              <div>
                <FaCircleXmark
                  className={`${classes.crossMark} ${classes.demoCheckMark}`}
                />{" "}
                Missing Ingredients
              </div>
            </div>
            <div className={classes.ingredientList}>
              {[...recipe["ingredients"]]
                .sort((a, b) => {
                  // First: Available + Fridge Required
                  if (
                    a.isAvailable &&
                    a.isFridgeRequired &&
                    !(b.isAvailable && b.isFridgeRequired)
                  )
                    return -1;
                  if (
                    b.isAvailable &&
                    b.isFridgeRequired &&
                    !(a.isAvailable && a.isFridgeRequired)
                  )
                    return 1;

                  // Second: Not Available + Fridge Required
                  if (
                    !a.isAvailable &&
                    a.isFridgeRequired &&
                    !(!b.isAvailable && b.isFridgeRequired)
                  )
                    return -1;
                  if (
                    !b.isAvailable &&
                    b.isFridgeRequired &&
                    !(!a.isAvailable && a.isFridgeRequired)
                  )
                    return 1;

                  return 0;
                })
                .map((ingredient, index) => (
                  <div key={index} className={classes.eachIngredient}>
                    {ingredient.isFridgeRequired && (
                      <span>
                        {ingredient.isAvailable ? (
                          <FaCircleCheck className={classes.checkMark} />
                        ) : (
                          <FaCircleXmark className={classes.crossMark} />
                        )}
                      </span>
                    )}
                    {ingredient.name}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className={classes.instructionsContainer}>
        <h6>
          <GiCookingPot color="#795548" /> {"  "} Cooking Instructions
        </h6>
        <div>
          {recipe["steps"].map((step, index) => {
            return (
              <div key={index} className={classes.stepsList}>
                <span>{index + 1}.</span> {step.replace(/\*\*/g, "")}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
