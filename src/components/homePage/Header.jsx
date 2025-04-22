import React, { useEffect, useRef, useState } from "react";
import { FaBars, FaClipboardList, FaHome, FaUtensils } from "react-icons/fa";
import classes from "../../styles/home.module.scss";
import { useNavigate } from "react-router-dom";
import { GiMeal } from "react-icons/gi";
import { MdOutlineRestaurantMenu } from "react-icons/md";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };
  const handleFridgeInventoryClick = () => {
    navigate("/fridge");
  };

  const handleRecipeIdeaClick = () => {
    navigate("/recipeIdea");
  };

  const handleAllRecipesClick = () => {
    navigate("/allRecipes");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={classes.headerContainer}>
      <div className={classes.appName} onClick={handleHomeClick}>
        <FaUtensils />
        <div>FridgeRecipe</div>
      </div>

      <div className={classes.appRoutes}>
        {/* <div onClick={handleHomeClick}>Home</div> */}
        <div onClick={handleFridgeInventoryClick}>Fridge Inventory</div>
        <div onClick={handleRecipeIdeaClick}>Recipe Ideas</div>
        <div onClick={handleAllRecipesClick}>All Recipes</div>
      </div>

      {/* Mobile Navigation */}
      <div className={classes.mobileMenu} ref={dropdownRef}>
        <button
          className={classes.hamburgerIcon}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <FaBars />
        </button>

        <div
          className={`${classes.mobileDropdown} ${isOpen ? classes.show : ""}`}
        >
          <div onClick={handleHomeClick}>
            <FaHome /> Home
          </div>
          <div onClick={handleFridgeInventoryClick}>
            <FaClipboardList /> My Fridge
          </div>
          <div onClick={handleRecipeIdeaClick}>
            <GiMeal /> Recipe Ideas
          </div>
          <div onClick={handleAllRecipesClick}>
            <MdOutlineRestaurantMenu /> All Recipes
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
