import React, { useEffect, useRef, useState } from "react";
import { FaBars, FaUtensils } from "react-icons/fa";
import classes from "../../styles/home.module.scss";
import { useNavigate } from "react-router-dom";

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
    navigate("/recipes");
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
      <div className={classes.appName}>
        <FaUtensils />
        <div>FridgeRecipe</div>
      </div>

      <div className={classes.appRoutes}>
        <div onClick={handleHomeClick}>Home</div>
        <div onClick={handleFridgeInventoryClick}>Fridge Inventory</div>
        <div onClick={handleRecipeIdeaClick}>Recipe Ideas</div>
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
          <div onClick={handleHomeClick}>Home</div>
          <div onClick={handleFridgeInventoryClick}>Fridge Inventory</div>
          <div onClick={handleRecipeIdeaClick}>Recipe Ideas</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
