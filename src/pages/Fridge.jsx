import Header from "@/components/homePage/Header";
import React, { useEffect } from "react";
import classes from "../styles/fridge.module.scss";
import FridgeComponent from "@/components/fridgeInventory/FridgeComponent";
import { useDispatch } from "react-redux";
import { fetchIngredients } from "@/redux/fridgeSlice";

const Fridge = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, []);
  return (
    <div className={classes.mainContainer}>
      <Header />
      <FridgeComponent />
    </div>
  );
};

export default Fridge;
