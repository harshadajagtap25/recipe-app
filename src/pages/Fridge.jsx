import Header from "@/components/homePage/Header";
import React, { useEffect } from "react";
import classes from "../styles/fridge.module.scss";
import FridgeComponent from "@/components/fridgeInventory/FridgeComponent";
import { useDispatch } from "react-redux";
import { fetchIngredientsForDisplay } from "@/redux/fridgeSlice";
import { useAuth } from "@/contexts/AuthContext";

const Fridge = () => {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();

  useEffect(() => {
    dispatch(fetchIngredientsForDisplay(currentUser.id));
  }, []);

  return (
    <div className={classes.mainContainer}>
      <Header />
      <FridgeComponent />
    </div>
  );
};

export default Fridge;
