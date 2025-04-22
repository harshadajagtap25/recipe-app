import React from "react";
import classes from "../../styles/fridge.module.scss";
import HeaderContainer from "./HeaderContainer";
import CardsContainer from "./CardsContainer";
import { FaClipboardList } from "react-icons/fa";

const FridgeComponent = () => {
  return (
    <div className={classes.wrapper}>
      <h2 className={classes.pageTitle}>
        <FaClipboardList color="#2e7d32" /> What&apos;s in My Fridge?
      </h2>
      <p className={classes.instructions}>
        A quick overview of everything you have in your fridge, ready to use.{" "}
      </p>

      <HeaderContainer />
      <CardsContainer />
    </div>
  );
};

export default FridgeComponent;
