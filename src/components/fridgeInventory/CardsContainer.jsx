import React from "react";
import classes from "../../styles/fridge.module.scss";
import IngredientCard from "./IngredientCard";
import { useSelector } from "react-redux";

const CardsContainer = () => {
  const { ingredients } = useSelector((state) => state.fridge);

  return (
    <div className={classes.cardsContainerWrapper}>
      {ingredients.length <= 0 ? (
        <div className={classes.noIngredientText}>
          <p>No ingredient in invetory</p>
          <p>
            Click on{" "}
            <span
              style={{ color: "#4caf50", fontWeight: "bold", fontSize: "20px" }}
            >
              '+'
            </span>{" "}
            to add ingredients
          </p>
        </div>
      ) : (
        ingredients.map((item, index) => {
          return <IngredientCard key={index} ingredient={item} />;
        })
      )}
    </div>
  );
};

export default CardsContainer;
