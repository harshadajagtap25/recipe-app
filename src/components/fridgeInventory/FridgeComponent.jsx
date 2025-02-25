import React from "react";
import classes from "../../styles/fridge.module.scss";
import HeaderContainer from "./HeaderContainer";
import CardsContainer from "./CardsContainer";

const FridgeComponent = () => {
  return (
    <div className={classes.wrapper}>
      <HeaderContainer />
      <CardsContainer />
    </div>
  );
};

export default FridgeComponent;
