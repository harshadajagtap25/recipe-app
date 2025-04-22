import React, { useState } from "react";
import classes from "../../styles/SearchSection.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FridgeRecipeIllustratiom from "./FridgeRecipeIllustratiom";

const SearchSection = () => {
  const navigate = useNavigate();

  // const handleSearch = async (event) => {
  //   event.preventDefault();

  //   if (event.key === "Enter") {
  //     const value = event.target.value;
  //     if (value.trim() === "") {
  //       setErrorMessage("Enter a recipe name");

  //       setTimeout(() => {
  //         setErrorMessage("");
  //       }, 3000);
  //     } else {
  //       setErrorMessage("");

  //       try {
  //         const response = await dispatch(fetchSearchedRecipe(value)).unwrap();

  //         if (response.length > 0) {
  //           navigate(`/searched`);
  //         } else {
  //           setErrorMessage("No recipes found!");
  //         }
  //       } catch (error) {
  //         // console.error("Fetch failed:", error);
  //         setErrorMessage("Failed to fetch recipe");
  //       }
  //     }
  //   }
  // };

  const handleFridgeInventoryClick = () => {
    let path = "/fridge";
    navigate(path);
  };

  const handleRecipeIdeaClick = () => {
    let path = "/recipeIdea";
    navigate(path);
  };

  return (
    <div className={classes.mainContainer}>
      <div className={classes.illustrationWrapper}>
        <FridgeRecipeIllustratiom />
      </div>
      <h2 className={classes.title}>Welcome To FridgeRecipe!</h2>
      <div className={classes.description}>
        Discover recipes you can cook with ingredients you already have.
      </div>
      {/* <div className={classes.searchWrapper}>
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
      </div> */}
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
