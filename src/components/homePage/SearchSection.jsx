import React, { useState } from "react";
import classes from "../../styles/SearchSection.module.scss";
import { useDispatch } from "react-redux";
import { fetchSearchedRecipe } from "@/redux/recipeSlice";
import { useNavigate } from "react-router-dom";

const SearchSection = () => {
  const [searchText, setSearchText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();

    if (event.key === "Enter") {
      const value = event.target.value;
      if (value.trim() === "") {
        setErrorMessage("Enter a recipe name");

        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      } else {
        setErrorMessage("");

        dispatch(fetchSearchedRecipe(value)).then(() => {
          // navigate("/recipes");
        });
      }
    }
  };

  const handleFridgeInventoryClick = () => {
    let path = "/fridge";
    navigate(path);
  };

  const handleRecipeIdeaClick = () => {
    let path = "/recipes";
    navigate(path);
  };

  return (
    <div className={classes.mainContainer}>
      <div className={classes.title}>Welcome To FridgeRecipe!</div>
      <div className={classes.description}>
        Discover recipes you can cook with ingredients you already have.
      </div>
      <div className={classes.searchWrapper}>
        <input
          type="text"
          className={classes.searchInput}
          placeholder="Search for a recipes..."
          onChange={(e) => setSearchText(e.target.value)}
          onKeyUp={(event) => {
            handleSearch(event);
          }}
          value={searchText}
        />
        {errorMessage && (
          <div className={classes.errorMessageDiv}>{errorMessage}</div>
        )}
      </div>
      <div className={classes.buttonsWrapper}>
        <button
          className={classes.homeButtons}
          onClick={handleFridgeInventoryClick}
        >
          Fridge Inventory
        </button>
        <button className={classes.homeButtons} onClick={handleRecipeIdeaClick}>
          Recipe Ideas
        </button>
      </div>
    </div>
  );
};

export default SearchSection;
