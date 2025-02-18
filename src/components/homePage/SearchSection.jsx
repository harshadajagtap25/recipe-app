import React from "react";
import classes from "../../styles/SearchSection.module.scss";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "@/redux/recipeSlice";

const SearchSection = () => {
  const dispatch = useDispatch();

  const handleSearch = (event) => {
    dispatch(setSearchQuery(event.target.value));
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
          onChange={handleSearch}
        />
      </div>
      <div className={classes.buttonsWrapper}>
        <button className={classes.homeButtons}>Fridge Inventory</button>
        <button className={classes.homeButtons}>Recipe Ideas</button>
      </div>
    </div>
  );
};

export default SearchSection;
